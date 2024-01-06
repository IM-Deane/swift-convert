import React, { useRef } from "react";

import type Uppy from "@uppy/core";

import { ArrowDownOnSquareStackIcon } from "@heroicons/react/20/solid";

import { useSettingsContext } from "@/context/SettingsProvider";
import UppyDashboard from "./UppyDashboard";
import { MaxFileSize } from "@/types/index";

function FileUploader({
	uppy,
	onUpload,
	resetFileData,
	isDownloadDisabled,
	handleDownloadPhotos,
}: {
	uppy: Uppy;
	isDownloadDisabled: boolean;
	onUpload: (imageData, elapsedTime) => void;
	handleDownloadPhotos: () => void;
	resetFileData: () => void;
}) {
	const dropzoneRef = useRef();
	const { settings } = useSettingsContext();

	// triggers local device uploader
	const handleOpenLocalFileDialog = () => {
		// Note that the ref is set async so it might be null at some point
		if (dropzoneRef.current) {
			// @ts-expect-error Property 'open' does not exist on type 'never'.ts(2339)
			dropzoneRef.current.open();
		}
	};

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
									{/* <SelectUploadMethod uploadOptions={uploadOptions} /> */}
								</div>
								<div className=" mt-4 md:my-auto flex-inline">
									<button
										type="button"
										disabled={isDownloadDisabled}
										onClick={handleDownloadPhotos}
										className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ${
											isDownloadDisabled
												? "cursor-not-allowed bg-gray-200"
												: "cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 flex-1 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
										}`}
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
										onClick={resetFileData}
										className={`${
											!isDownloadDisabled
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
							uppy={uppy}
							onUpload={onUpload}
							restrictions={{
								maxTotalFileSize: MaxFileSize.free,
								maxNumberOfFiles: 10,
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
		</div>
	);
}

export default FileUploader;
