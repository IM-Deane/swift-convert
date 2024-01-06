import React, { useState, useRef } from "react";

import Dropzone from "react-dropzone";

import {
	FolderOpenIcon,
	ArrowDownOnSquareStackIcon,
} from "@heroicons/react/20/solid";

import * as Fathom from "fathom-client";
import prettyBytes from "pretty-bytes";

import { UploadOption } from "@/types/index";
import { useSettingsContext } from "@/context/SettingsProvider";
import { toast } from "react-hot-toast";
import Alert from "./Alert";
import SelectUploadMethod from "./SelectUploadMethod";
import DropboxChooseModal from "./DropboxChooseModal";
import UppyDashboard from "./UppyDashboard";
import { convertToBrowserFileObjects } from "@/utils/index";

import type { DropboxChooserFile } from "@/types/api";
import { MaxFileSize } from "@/types/index";

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

	if (
		!settings ||
		settings.fileInputId === undefined ||
		settings.imageQuality === undefined
	) {
		return <div>Loading...</div>;
	}

	return (
		<div className="mt-2">
			<div className="mt-5 md:col-span-2 md:mt-0">
				<div className="shadow sm:overflow-hidden sm:rounded-md">
					<div className="space-y-6 bg-white px-4 py-5 sm:p-6">
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
						<UppyDashboard
							restrictions={{
								maxFileSize: MaxFileSize.free,
								allowedFileTypes: [`image/${settings.fileInputId}`],
							}}
							conversionParams={{
								convertToFormat: settings.fileOutputId,
								imageQuality: settings.imageQuality,
							}}
						/>
					</div>
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
