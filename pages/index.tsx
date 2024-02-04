import { useState, useEffect } from "react";

import { usePostHog } from "posthog-js/react";
import { toast } from "react-hot-toast";
import type Uppy from "@uppy/core";

import siteConfig from "site.config";
import { ArrowDownOnSquareStackIcon } from "@heroicons/react/20/solid";

import { FileType, fileTypes, type ImageFile } from "@/types/index";

import Alert from "@/components/Alert";
import Layout from "@/components/Layout";
import FileUploader from "@/components/FileUploader";
import ImageGallery from "@/components/ImageGallery";
import SavePhotosDropdown from "@/components/SavePhotosDropdown";
import WaitListModal from "@/components/marketing/WaitListModal";

import { useSettingsContext } from "@/context/SettingsProvider";

import {
	generateClientImage,
	compressAndSaveImages,
	getServerUrl,
	generateInitialClientImage,
} from "@/utils/index";
import FileDetails from "@/components/FileDetails";

export default function Home({ uppy }: { uppy: Uppy }) {
	const posthog = usePostHog();

	const [currentFile, setCurrentFile] = useState<ImageFile>(null);
	const [imageResults, setImageResults] = useState<ImageFile[]>([]);
	const [isDownloadDisabled, setIsDownloadDisabled] = useState<boolean>(true);
	const [showWaitListModal, setShowWaitListModal] = useState<boolean>(false);

	const {
		settings,
		selectedFeature,
		handleSelectFeature,
		handleknownUploadedFileTypes,
	} = useSettingsContext();

	const resetFileData = () => {
		setCurrentFile(null);
		setImageResults([]);
		setIsDownloadDisabled(true);
		handleknownUploadedFileTypes(null);
		uppy.cancelAll({ reason: "user" });

		posthog.capture("reset_results");
	};

	const updateCurrentFile = (file: ImageFile | null) => {
		if (!file) {
			const resetImages = imageResults.map((image) => ({
				...image,
				current: false,
			}));
			setImageResults(resetImages);
			posthog.capture("close_image_details", {
				imageName: "none",
			});
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
			posthog.capture("view_image_details", {
				imageName: file?.name,
			});
		}
		setCurrentFile(file);
	};

	const handleDeleteImage = () => {
		const newImageResults = imageResults.filter(
			(image) => image.name !== currentFile.name
		);
		setImageResults(newImageResults);
		setCurrentFile(null);

		posthog.capture("delete_current_image", {
			imageName: currentFile.name,
		});

		if (imageResults.length === 0) {
			resetFileData();
		}
	};

	const subscribeToSSE = (fileId: string) => {
		const BASE_API_URL = getServerUrl();
		const eventSource = new EventSource(
			`${BASE_API_URL}/api/events?fileId=${fileId}`
		);

		eventSource.onmessage = function (event) {
			const data = JSON.parse(event.data);
			updateProgress(fileId, data.progress);
			if (data.progress === 100) eventSource.close();
		};

		eventSource.onerror = function (err) {
			console.error("SSE error:", err);
			eventSource.close();
		};
	};

	const updateProgress = (fileId: string, progressValue: number) =>
		setImageResults((prevImageResults) =>
			prevImageResults.map((image) => {
				if (image.id === fileId) {
					return {
						...image,
						progress: progressValue,
					};
				}
				return image;
			})
		);

	const setUpConversionProgressUpdates = (file: any, fileId: string) => {
		subscribeToSSE(fileId);
		const newImage = generateInitialClientImage(file, fileId);

		setImageResults((prevImageResults) =>
			prevImageResults.map((image) => (image.id === fileId ? newImage : image))
		);
	};

	const convertUploadedImage = async (
		file: any,
		fileId: string,
		conversionParams
	) => {
		const serverUrl = getServerUrl();
		const conversionUrl = `${serverUrl}/api/v2/convert`;
		try {
			setUpConversionProgressUpdates(file, fileId);
			const conversionResponse = await fetch(conversionUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fileId: fileId,
					convertToFormat: conversionParams.convertToFormat,
					imageQuality: conversionParams.imageQuality,
				}),
			});

			if (!conversionResponse.ok) {
				console.error("Conversion request failed for fileId:", fileId);
				throw new Error(`HTTP error! status: ${conversionResponse.status}`);
			}

			const elapsedTime = conversionResponse.headers.get("Server-Timing");
			const data = await conversionResponse.json();
			handleFileConversion(data, elapsedTime);
		} catch (error: any) {
			console.error("Conversion failed for", file.name, error);
		}
	};

	const handleFileConversion = (image, elapsedTime) => {
		const generatedImage = generateClientImage({
			previewlUrl: image.previewUrl,
			downloadUrl: image.downloadUrl,
			filename: image.filename,
			fileId: image.fileId,
			fileType: image.metadata.filetype,
			elapsedTime,
			metadata: image.metadata,
			additionalInfo: {
				imageQuality: settings.imageQuality,
			},
		});

		handleUpdateImageResults(generatedImage);
		setIsDownloadDisabled(false);
	};

	const handleUpdateImageResults = (newImage: ImageFile) => {
		setImageResults((prevImageResults) => {
			let found = false;

			const updatedImageResults = prevImageResults.reduce((acc, image) => {
				if (image.id === newImage.id) {
					found = true;
					acc.push({ ...newImage, current: false });
				} else {
					acc.push(image);
				}
				return acc;
			}, []);

			if (!found) updatedImageResults.push({ ...newImage, current: false });

			return updatedImageResults;
		});
	};

	const handleDownloadPhotos = async () => {
		try {
			await compressAndSaveImages(imageResults);

			posthog.capture("download_all_images", {
				imageCount: imageResults.length,
			});
		} catch (error) {
			console.error(error);
		}
	};

	const handleOpenWaitListModal = (featureId: string) => {
		handleSelectFeature(featureId);
		setShowWaitListModal(true);

		posthog.capture("open_waitlist_modal", {
			featureId,
		});
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

			posthog.capture("waitlist_success", {
				featureId: selectedFeature.id,
			});
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

	useEffect(() => {
		const handleBulkFileConversions = async (fileIds: string[]) => {
			const conversionParams = {
				convertToFormat: settings.fileOutputId,
				imageQuality: settings.imageQuality,
			};

			const conversionPromises = fileIds.map((fileId) => {
				const file = uppy.getFile(fileId);
				return convertUploadedImage(file, fileId, conversionParams);
			});

			try {
				await Promise.all(conversionPromises);
				toast.custom(({ visible }) => (
					<Alert
						type="success"
						isOpen={visible}
						title="Conversions Complete! 🎉"
						message="Your files are ready for download."
					/>
				));
			} catch (error) {
				console.error("An error occurred during file conversions", error);
			}
		};

		uppy.addPostProcessor(async (uploadedFileIds) => {
			await handleBulkFileConversions(uploadedFileIds);
		});

		return () => {
			uppy.removePostProcessor(handleBulkFileConversions);
		};
	}, [uppy, settings.fileOutputId, settings.imageQuality]);

	return (
		<Layout>
			<div className="flex flex-1 items-stretch">
				<main className="flex-1 overflow-y-auto">
					<div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
						<div className="border-b border-gray-200 pb-5">
							<h1 className="text-2xl font-semibold leading-6 text-gray-900">
								{siteConfig.slogan}
							</h1>
							<p className="mt-4 max-w-4xl text-sm text-gray-800">
								Currently supported output formats:{" "}
								<span className="text-blue-800">
									{fileTypes
										.filter(
											(type) =>
												type.id !== FileType.heic && type.id !== FileType.heif
										)
										.map((type) => type.name.toLowerCase())
										.join(" | ")}
								</span>
							</p>
						</div>
						<section
							className="flex flex-col lg:flex-row space-x-4 mt-2 pb-12"
							aria-labelledby="main-heading"
						>
							<div className="flex-auto lg:w-48 order-last lg:order-first">
								<FileUploader uppy={uppy} />
							</div>
							<div className="flex-1 mt-8 md:mt-0 p-4">
								<div className="border-b border-gray-200 pb-5 mb-8 sm:flex sm:items-center sm:justify-between">
									<h2 className="text-base font-semibold leading-5 text-gray-900">
										Results
									</h2>
									<div className="mt-3 flex sm:ml-4 sm:mt-0">
										<SavePhotosDropdown
											imageResults={imageResults}
											isDownloadDisabled={isDownloadDisabled}
										/>
										<button
											type="button"
											onClick={resetFileData}
											className={`${
												!isDownloadDisabled
													? "cursor-pointer bg-white hover:bg-gray-200"
													: "text-white cursor-not-allowed bg-gray-200"
											} rounded-lg inline-flex items-center ml-3 px-2 py-2.5 text-sm font-medium text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300`}
										>
											Reset
										</button>
									</div>
								</div>
								<ImageGallery
									imageFiles={imageResults}
									setCurrentFile={updateCurrentFile}
								/>
							</div>
						</section>
					</div>
				</main>
				{currentFile && (
					<FileDetails
						currentFile={currentFile}
						updateCurrentFile={updateCurrentFile}
						handleDeleteImage={handleDeleteImage}
						handleOpenWaitListModal={handleOpenWaitListModal}
					/>
				)}
				<WaitListModal
					isOpen={showWaitListModal}
					handleCloseModal={handleCloseWaitListModal}
					handleResult={handleWaitListResult}
					feature={{ ...selectedFeature }}
				/>
			</div>
		</Layout>
	);
}
