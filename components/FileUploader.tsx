import React, { useState, useRef } from "react";

import Dropzone from "react-dropzone";

import {
	FolderOpenIcon,
	ArrowDownOnSquareStackIcon,
} from "@heroicons/react/20/solid";

import * as Fathom from "fathom-client";

import { UploadOption } from "@/types/index";
import { useSettingsContext } from "@/context/SettingsProvider";
import { toast } from "react-hot-toast";
import Alert from "./Alert";
import SelectUploadMethod from "./SelectUploadMethod";
import DropboxChooseModal from "./DropboxChooseModal";
import { convertToBrowserFileObjects } from "@/utils/index";

import type { DropboxChooserFile } from "@/types/api";

function FileUploader({
	onUpload,
	resetFileData,
	isDownloadDisabled,
	handleDownloadPhotos,
}: {
	isDownloadDisabled: boolean;
	onUpload: (validFiles: File[]) => void;
	handleDownloadPhotos: () => void;
	resetFileData: () => void;
}) {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [showDropboxChooser, setShowDropboxChooser] = useState<boolean>(false);

	const dropzoneRef = useRef();
	const { settings } = useSettingsContext();

	const clearFileData = () => {
		setSelectedFiles([]);
		resetFileData();
	};

	const handleFileDrop = (files: File[]): void => {
		const validFiles = files.filter((file: File) => {
			if (file.name.toLowerCase().includes("." + settings.fileInputId)) {
				return file;
			}
			toast.custom(({ visible }) => (
				<Alert
					type="error"
					isOpen={visible}
					title="Invalid file type detected 🧐"
					message="That file doesn't match your chosen input. Update your settings or choose a new file."
				/>
			));
			return;
		});
		setSelectedFiles(validFiles);
		onUpload(validFiles);
	};

	// triggers local device uploader
	const handleOpenLocalFileDialog = () => {
		// Note that the ref is set async so it might be null at some point
		if (dropzoneRef.current) {
			// @ts-expect-error Property 'open' does not exist on type 'never'.ts(2339)
			dropzoneRef.current.open();
		}
	};

	const handleDropboxChooserOpen = () => {
		setShowDropboxChooser(true);
		Fathom.trackGoal("EGRZJJPS", 0); // see if people care about using Dropbox uploader
	};

	const handleDropboxChooserDownload = async (files: DropboxChooserFile[]) => {
		const fileObjects = await convertToBrowserFileObjects(files);
		Fathom.trackGoal("XTTZ7MKP", 0); // we want to know if users are importing files
		handleFileDrop(fileObjects);
	};

	const uploadOptions: UploadOption[] = [
		{
			id: 1,
			name: "From Current Device",
			icon: FolderOpenIcon,
			action: handleOpenLocalFileDialog,
		},
		{
			id: 2,
			name: "From Dropbox",
			icon: () => (
				<svg
					width="20px"
					height="20px"
					viewBox="0 -0.5 20 20"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<g
						id="Page-1"
						stroke="none"
						strokeWidth="1"
						fill="none"
						fillRule="evenodd"
					>
						<g
							id="Dribbble-Light-Preview"
							transform="translate(-300.000000, -7479.000000)"
							fill="#000000"
						>
							<g id="icons" transform="translate(56.000000, 160.000000)">
								<path
									d="M254.012,7330.74707 L249.825,7334.24637 L248,7333.0687 L248,7334.38937 L254,7338 L260,7334.38937 L260,7333.0687 L258.187,7334.24637 L254.012,7330.74707 Z M264,7322.92318 L258.117,7319 L254,7322.50952 L259.932,7326.25089 L264,7322.92318 Z M254,7329.99226 L258.117,7333.50177 L264,7329.57859 L259.932,7326.25089 L254,7329.99226 Z M244,7329.57859 L249.883,7333.50177 L254,7329.99226 L248.068,7326.25089 L244,7329.57859 Z M254,7322.50952 L248.068,7326.25089 L244,7322.92318 L249.883,7319 L254,7322.50952 Z"
									id="dropbox-[#158]"
								/>
							</g>
						</g>
					</g>
				</svg>
			),
			action: handleDropboxChooserOpen,
		},
	];

	return (
		<div className="mt-2">
			<div className="mt-5 md:col-span-2 md:mt-0">
				<div className="shadow sm:overflow-hidden sm:rounded-md">
					<ul className="space-y-6 bg-white px-4 py-5 sm:p-6">
						<li>
							<div className="bg-gray-50 px-4 py-3 mb-8 sm:px-6">
								<div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between mt-4 lg:mt-auto">
									<div className="grow">
										<SelectUploadMethod uploadOptions={uploadOptions} />
									</div>
									<div className=" mt-4 md:my-auto flex-inline">
										<button
											type="button"
											disabled={isDownloadDisabled}
											onClick={handleDownloadPhotos}
											className={`${
												isDownloadDisabled
													? "cursor-not-allowed bg-blue-200"
													: "cursor-pointer bg-blue-700 hover:bg-blue-800"
											} text-white focus:ring-4 flex-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
										>
											Download{" "}
											<span className="hidden md:inline ml-1">photos</span>
											<span>
												<ArrowDownOnSquareStackIcon
													className="h-5 w-5 ml-2"
													aria-hidden="true"
												/>
											</span>
										</button>
										<button
											type="button"
											onClick={clearFileData}
											className={`${
												selectedFiles.length > 0
													? "cursor-pointer bg-white hover:bg-gray-50"
													: "cursor-not-allowed bg-gray-200 "
											} rounded-lg flex-initial ml-3 px-2 py-2.5 text-sm font-medium text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300`}
										>
											Clear <span className="hidden md:inline">files</span>
										</button>
									</div>
								</div>
							</div>
							<Dropzone
								ref={dropzoneRef}
								onDrop={handleFileDrop}
								multiple={true}
								maxFiles={5}
							>
								{({ getRootProps, getInputProps }) => (
									<div
										{...getRootProps()}
										className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6"
									>
										{/* Show uploaded files  */}
										{selectedFiles.length > 0 ? (
											<ul role="list">
												{selectedFiles.map((file) => (
													<li key={file.lastModified} className="flex py-2">
														<div className="ml-3">
															<p className="text-sm font-medium text-blue-600">
																{file.name}
															</p>
														</div>
													</li>
												))}
											</ul>
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
														<span>Upload photo from device</span>
														<input
															{...getInputProps()}
															id="image-file"
															name="image-file"
															type="file"
															className="sr-only"
															accept={`image/${settings?.fileInputId}`}
														/>
													</label>
													<p className="pl-1">or drag and drop</p>
												</div>
												<p className="text-xs text-gray-500">.HEIC up to 2MB</p>
											</div>
										)}
									</div>
								)}
							</Dropzone>
						</li>
					</ul>
				</div>
			</div>
			<DropboxChooseModal
				isOpen={showDropboxChooser}
				setIsOpen={setShowDropboxChooser}
				onSuccess={handleDropboxChooserDownload}
			/>
		</div>
	);
}

export default FileUploader;
