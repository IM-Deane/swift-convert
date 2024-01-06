import { useState } from "react";
import Image from "next/image";
import Script from "next/script";

import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

import siteConfig from "site.config";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

import type { ImageFile } from "@/types/index";

import Alert from "@/components/Alert";
import Layout from "@/components/Layout";
import FileUploader from "@/components/FileUploader";
import ImageGallery from "@/components/ImageGallery";
import WaitListModal from "@/components/marketing/WaitListModal";

import { useSettingsContext } from "@/context/SettingsProvider";

import {
	generateClientImage,
	generateInitialClientImage,
	compressAndSaveImages,
} from "@/utils/index";

export default function Home() {
	const fileMap = new Map();
	const [currentFile, setCurrentFile] = useState<ImageFile>(null);
	const [imageResults, setImageResults] = useState<ImageFile[]>([]);
	const [isDownloadDisabled, setIsDownloadDisabled] = useState<boolean>(true);
	const [showWaitListModal, setShowWaitListModal] = useState<boolean>(false);

	const { settings, selectedFeature, handleSelectFeature } =
		useSettingsContext();

	const resetFileData = () => {
		setCurrentFile(null);
		setImageResults([]);
		setIsDownloadDisabled(true);
		fileMap.clear();
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
		fileMap.delete(currentFile.id);
		if (imageResults.length === 0) {
			resetFileData();
		}
	};
	console.log("imageResults", imageResults);

	const handleFileUpload = (image, elapsedTime) => {
		const generatedImage = generateClientImage({
			imageData: image.data,
			filename: image.filename,
			fileId: image.fileId,
			fileType: image.metadata.filetype,
			elapsedTime,
			metadata: image.metadata,
			additionalInfo: {
				imageQuality: settings.imageQuality,
			},
		});

		const newImageResults = [
			...imageResults,
			{
				...generatedImage,
			},
		];

		setImageResults(newImageResults);
		setIsDownloadDisabled(false);
	};

	const handleDownloadPhotos = async () => {
		try {
			await compressAndSaveImages(imageResults);
		} catch (error) {
			console.error(error);
		}
	};

	const handleOpenWaitListModal = (featureId: string) => {
		handleSelectFeature(featureId);
		setShowWaitListModal(true);
	};
	const handleCloseWaitListModal = () => setShowWaitListModal(false);

	const handleWaitListResult = (waitlistResult: boolean) => {
		if (waitlistResult) {
			toast.custom(({ visible }) => (
				<Alert
					type="success"
					isOpen={visible}
					title="You've been added to the waitlist! 🎉"
					message="Check your email to learn more."
				/>
			));
		} else {
			toast.custom(({ visible }) => (
				<Alert
					type="error"
					isOpen={visible}
					title="We had some trouble with your request. 😓"
					message="Try again in a few minutes."
				/>
			));
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
										<button
											type="button"
											onClick={() =>
												handleOpenWaitListModal(
													siteConfig.featureDiscovery.emailImageResults.id
												)
											}
											className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
										>
											<PaperAirplaneIcon
												className="h-6 w-6"
												aria-hidden="true"
											/>
											<span className="sr-only">Send an email</span>
										</button>
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
					<WaitListModal
						isOpen={showWaitListModal}
						handleCloseModal={handleCloseWaitListModal}
						handleResult={handleWaitListResult}
						feature={{ ...selectedFeature }}
					/>
				</div>
			</Layout>
		</>
	);
}
