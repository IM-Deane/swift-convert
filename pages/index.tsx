import { useState } from "react";

import Script from "next/script";

import siteConfig from "site.config";
import { XMarkIcon } from "@heroicons/react/24/outline";

import type { ImageFile } from "@/types/index";

import Layout from "@/components/Layout";
import FileUploader from "@/components/FileUploader";
import ImageGallery from "@/components/ImageGallery";

import { useSettingsContext } from "@/context/SettingsProvider";

import {
	generateClientImage,
	generateInitialClientImage,
	compressAndSaveImages,
} from "@/utils/index";
import Image from "next/image";

export default function Home() {
	const [currentFile, setCurrentFile] = useState<ImageFile>(null);
	const [imageResults, setImageResults] = useState<ImageFile[]>([]);
	const [isDownloadDisabled, setIsDownloadDisabled] = useState<boolean>(true);

	const { settings } = useSettingsContext();

	const resetFileData = () => {
		setCurrentFile(null);
		setImageResults([]);
		setIsDownloadDisabled(true);
	};

	const updateCurrentFile = (file: ImageFile | null) => {
		if (!file) {
			const resetImages = imageResults.map((image) => ({
				...image,
				current: false,
			}));
			setImageResults(resetImages);
		} else {
			const newImageResults = imageResults.map((image) => {
				if (image.name === file.name) {
					return {
						...file,
						current: false,
					};
				}
				return {
					...image,
					current: false,
				};
			});
			setImageResults(newImageResults);
		}
		setCurrentFile(file);
	};

	const handleDeleteImage = () => {
		const newImageResults = imageResults.filter(
			(image) => image.name !== currentFile.name
		);
		setImageResults(newImageResults);
		setCurrentFile(null);
		if (imageResults.length === 0) {
			resetFileData();
		}
	};

	// render image progress updates in real-time
	const updateProgress = (index, progressValue) =>
		setImageResults((prevImageResults) =>
			prevImageResults.map((image, idx) => {
				if (idx === index) {
					return { ...image, progress: progressValue };
				}
				return image;
			})
		);

	// Initialize progress state for each file
	const setupFileProgressUpdate = (files: File[]) => {
		const SERVER_URL = process.env.NEXT_PUBLIC_SSE_URL;
		setImageResults([]);
		const tempClientImages: ImageFile[] = [];

		files.forEach((file, index) => {
			const eventSource = new EventSource(
				`${SERVER_URL}/events?fileId=${index}`
			);
			eventSource.onmessage = (event) => {
				const progressValue = parseInt(event.data, 10);
				updateProgress(index, progressValue);
			};
			eventSource.onerror = (error) => {
				console.error("EventSource error:", error);
			};

			// add images to client for progress updates
			tempClientImages.push(generateInitialClientImage(file));
		});
		setImageResults(tempClientImages);
	};

	const handleFileUpload = async (files: File[]) => {
		const SERVER_URL = process.env.NEXT_PUBLIC_SSE_URL;

		const formData = new FormData();
		files.forEach((file, index) => {
			formData.append("images", file);
			formData.append("fileIds", index.toString());
		});

		formData.append("convertToFormat", settings.fileOutputId);
		formData.append("imageQuality", settings.imageQuality.toString());

		setupFileProgressUpdate(files);

		const response = await fetch(`${SERVER_URL}/api/convert`, {
			method: "POST",
			body: formData,
		});
		const elapsedTime = response.headers.get("server-timing");
		const data = await response.json();

		const images = data.map((item, index) => {
			if (item.error) {
				console.error("Image conversion error:", item.errorMsg);
				return null;
			}

			const rawImageData = Uint8Array.from(atob(item.data), (c) =>
				c.charCodeAt(0)
			);

			const generatedImage = generateClientImage(
				rawImageData,
				item.filename,
				settings.fileOutputId,
				elapsedTime,
				{
					imageQuality: settings.imageQuality,
				}
			);

			// Update imageResults with the new data
			setImageResults((prevImageResults) =>
				prevImageResults.map((image, idx) => {
					if (idx === index) {
						return {
							...image,
							source: generatedImage.source,
							information: generatedImage.information,
							progress: 100, // Set progress to 100
						};
					}
					return image;
				})
			);

			return generatedImage;
		});
		setImageResults(images.filter((img) => img !== null));
		setIsDownloadDisabled(false);
	};

	const handleDownloadPhotos = async () => {
		try {
			await compressAndSaveImages(imageResults);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<Script
				type="text/javascript"
				src="https://www.dropbox.com/static/api/2/dropins.js"
				id="dropboxjs"
				data-app-key="0srlta70mx0izr1"
				onError={(e) => {
					console.error("Dropbox Chooser failed to load", e);
				}}
			/>

			<Layout>
				<div className="flex flex-1 items-stretch">
					<main className="flex-1 overflow-y-auto">
						<div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
							<div className="border-b border-gray-200 pb-5">
								<h1 className="text-base text-xl font-semibold leading-6 text-gray-900">
									{siteConfig.slogan}
								</h1>
								<p className="mt-2 max-w-4xl text-sm text-gray-500">
									Convert your HEIC photos in seconds with SwiftConvert - the
									fast and free online tool.
								</p>
								<p className="mt-4 max-w-4xl text-sm text-gray-500">
									Currently supported output formats:{" "}
									<span className="text-blue-800">.png | .jpeg</span>
								</p>
							</div>
							<section
								className="mt-2 pb-12 overflow-y-auto"
								aria-labelledby="main-heading"
							>
								<h2 id="main-heading" className="sr-only">
									Converting photos
								</h2>
								<FileUploader
									onUpload={handleFileUpload}
									resetFileData={resetFileData}
									isDownloadDisabled={isDownloadDisabled}
									handleDownloadPhotos={handleDownloadPhotos}
								/>
							</section>
							<section className="mt-8 pb-16">
								<ImageGallery
									imageFiles={imageResults}
									setCurrentFile={updateCurrentFile}
								/>
							</section>
						</div>
					</main>
					{/* Details sidebar */}
					{currentFile && (
						<aside className="w-96 h-full overflow-y-auto border-l border-gray-200 bg-white p-8 lg:block">
							<div className="space-y-6 pb-12">
								<div>
									<div className="float-right mt-0 mb-2 sm:block">
										<button
											type="button"
											className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
											onClick={() => updateCurrentFile(null)}
										>
											<span className="sr-only">Close</span>
											<XMarkIcon className="h-8 w-8" aria-hidden="true" />
										</button>
									</div>

									<div className="relative aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg">
										<Image
											src={currentFile.source}
											alt={currentFile.name}
											fill
											className="object-cover"
										/>
									</div>
									<div className="mt-4 flex items-start justify-between">
										<div>
											<h2 className="text-lg font-medium text-gray-900">
												<span className="sr-only">Details for </span>
												{currentFile.name}
											</h2>
											<p className="text-sm font-medium text-gray-500">
												{currentFile.size}
											</p>
										</div>
									</div>
								</div>
								<div>
									<h3 className="font-medium text-gray-900">Information</h3>
									<dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
										{Object.keys(currentFile.information).map((key) => (
											<div
												key={key}
												className="flex justify-between py-3 text-sm font-medium"
											>
												<dt className="text-gray-500">{key}</dt>
												<dd className="whitespace-nowrap text-gray-900">
													{currentFile.information[key]}
												</dd>
											</div>
										))}
									</dl>
								</div>
								<div className="flex gap-x-3">
									<a
										type="button"
										download={currentFile.name}
										href={currentFile.source}
										title={currentFile.name}
										className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm text-center font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
									>
										Download
									</a>
									<button
										type="button"
										onClick={handleDeleteImage}
										className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
									>
										Delete
									</button>
								</div>
							</div>
						</aside>
					)}
				</div>
			</Layout>
		</>
	);
}
