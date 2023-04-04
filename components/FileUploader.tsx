import React, { useState } from "react";

import Dropzone from "react-dropzone";

import UploadService from "@/services/upload-service";

import LoadingButton from "./LoadingButton";
import { FileType } from "@/types/index";
import { useSettingsContext } from "@/context/SettingsProvider";
import { toast } from "react-hot-toast";
import Alert from "./Alert";
import SelectUploadMethod, {
	UploadOption,
	uploadOptions as uploadOptionsList,
} from "./SelectUploadMethod";

function FileUploader({ handleResult }) {
	const [showProgressBar, setShowProgressBar] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState<any>(undefined);
	const [loading, setLoading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [transcribeProgress, setTranscribeProgress] = useState<number>(1);
	const [completionTime, setCompletionTime] = useState<number>(0);

	const [selectedFileOption, setSelectedFileOption] = useState<UploadOption>(
		uploadOptionsList[0]
	);
	// const [uploadOptions, setUploadOptions] =
	// 	useState<UploadOption[]>(uploadOptions);

	const { settings } = useSettingsContext();

	const handleSubmit = async () => {
		if (!selectedFiles) return;

		// TODO: provide multiple file uploads
		const currentFileData = selectedFiles[0]; // get first uploaded file

		if (
			!currentFileData.name.toLowerCase().includes("." + settings.fileInputId)
		) {
			toast.custom(({ visible }) => (
				<Alert
					type="error"
					isOpen={visible}
					title="Invalid file type detected 🧐"
					message="That file doesn't match your chosen input. Update your settings or choose a new file."
				/>
			));
			return;
		}
		setUploadProgress(0);
		setShowProgressBar(true);

		await uploadFileToServer(currentFileData, (fileUploadEvent) =>
			setUploadProgress(
				Math.round((100 * fileUploadEvent.loaded) / fileUploadEvent.total)
			)
		);
	};

	/**
	 * Wrapper method that uploads a file to the server
	 * @param fileData the file to upload
	 * @param uploadProgress a callback function that updates file upload progress
	 */
	const uploadFileToServer = async (
		fileData: File,
		uploadProgress: (fileUploadEvent) => void
	) => {
		setLoading(true);

		try {
			const response = await UploadService.newImage(
				fileData,
				FileType[settings.fileOutputId],
				uploadProgress
			);

			setCompletionTime(response.headers["server-timing"]);
			handleResult(response.data, fileData, response.headers["server-timing"]);
		} catch (error) {
			if (error.response) {
				// response with status code other than 2xx
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				// no response from server
				console.log(error.request);
			} else {
				// something wrong with request
				console.log(error);
			}
			console.log(error.config);

			// reset state
			setUploadProgress(0);
			setTranscribeProgress(1);
		} finally {
			setLoading(false);
			setSelectedFiles(undefined);
			setShowProgressBar(false);
		}
	};

	/**
	 * Method that handles file drops/uploads
	 * @param files an array of files
	 */
	const handleFileDrop = (files: File[]): void =>
		files.length > 0 && setSelectedFiles(files);

	/**
	 * Method that calculates and sets the total progress of the upload
	 * and transcription process.
	 */
	const getTotalProgress = () => {
		const progress = Math.round(
			((uploadProgress + transcribeProgress) / 200) * 100
		);
		return progress;
	};

	return (
		<div className="mt-2">
			<div className="mt-5 md:col-span-2 md:mt-0">
				{/* Progress bar */}
				<div className="my-6 py-5">
					{showProgressBar && (
						<div className="min-h-24">
							<h4 className="sr-only">Status</h4>
							<p className="text-sm font-medium text-gray-900">
								{uploadProgress < 100 && transcribeProgress < 100
									? "Processing..."
									: ""}
							</p>
							<div className="mt-6" aria-hidden="true">
								{/* upload segment */}
								<div className="overflow-hidden rounded-full bg-gray-200">
									<div
										className="h-2 rounded-full bg-blue-600"
										style={{
											width: `${getTotalProgress()}%`,
										}}
									/>
								</div>
								<div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
									<div className="text-blue-600">Uploading photo</div>
									<div
										className={`text-center ${
											uploadProgress === 100 ? "text-blue-600" : ""
										}`}
									>
										Converting photo
									</div>
									<div
										className={`text-center ${
											transcribeProgress >= 50 ? "text-blue-600" : ""
										}`}
									>
										Saving changes
									</div>
									<div
										className={`text-right ${
											transcribeProgress === 100 ? "text-blue-600" : ""
										}`}
									>
										Completed
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
				<div className="shadow sm:overflow-hidden sm:rounded-md">
					<div className="space-y-6 bg-white px-4 py-5 sm:p-6">
						<div>
							<Dropzone onDrop={handleFileDrop} multiple={false}>
								{({ getRootProps, getInputProps }) => (
									<div
										{...getRootProps()}
										className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6"
									>
										{/* Show uploaded file  */}
										{selectedFiles && selectedFiles[0].name ? (
											<p className="rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500">
												{selectedFiles && selectedFiles[0].name}
											</p>
										) : (
											<div className="space-y-1 text-center">
												<svg
													className="mx-auto h-12 w-12 text-gray-400"
													stroke="currentColor"
													fill="none"
													viewBox="0 0 48 48"
													aria-hidden="true"
												>
													<path
														d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
														strokeWidth={2}
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
												<div className="flex text-sm text-gray-600">
													<label
														htmlFor="image-file"
														className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
													>
														<span>Upload photo</span>
														<input
															{...getInputProps()}
															id="image-file"
															name="image-file"
															type="file"
															className="sr-only"
															accept="image/heic"
														/>
													</label>
													<p className="pl-1">or drag and drop</p>
												</div>
												<p className="text-xs text-gray-500">
													{".HEIC up to 2MB"}
												</p>
											</div>
										)}
									</div>
								)}
							</Dropzone>
						</div>
					</div>
					<div className="bg-gray-50 mb-20 px-4 py-3 text-right sm:px-6 flex flex-col md:flex-row md:justify-between items-center md:items-baseline">
						<div>
							<SelectUploadMethod
								selectedOption={selectedFileOption}
								handleSelectedMethod={setSelectedFileOption}
							/>
						</div>
						<div className="mt-4 md:mt:0">
							{!!completionTime && (
								<span className="mt-2 mr-8 text-sm text-blue-500">
									Completed conversion in <strong>{completionTime}</strong>
								</span>
							)}
							{selectedFiles?.length > 0 && (
								<button
									type="button"
									onClick={() => setSelectedFiles(undefined)}
									className="rounded-md bg-white mr-4 px-8 py-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
								>
									Cancel
								</button>
							)}
							<LoadingButton
								isLoading={loading}
								text="Convert"
								loadingText="Loading..."
								handleClick={handleSubmit}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default FileUploader;
