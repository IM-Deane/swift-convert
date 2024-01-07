import React, { useEffect, useState } from "react";

import type Uppy from "@uppy/core";

import { ArrowDownOnSquareStackIcon } from "@heroicons/react/20/solid";

import { useSettingsContext } from "@/context/SettingsProvider";
import UppyDashboard from "./UppyDashboard";
import SettingsModal from "./SettingsModal";
import ConvertToDropdown from "./ConvertToDropdown";

import { Input, MaxFileSize, fileTypes } from "@/types/index";
import prettyBytes from "pretty-bytes";

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
	const [settingsModalOpen, setSettingsModalOpen] = useState(false);
	const [selectedOutputType, setSelectedOutputType] = useState<Input>(
		fileTypes[0]
	);
	const [knownUploadedFileTypes, setKnownUploadedFileTypes] = useState<any>({});
	const [filteredOutputTypes, setFilteredOutputTypes] = useState<Input[]>([]);

	const { settings } = useSettingsContext();

	const handleknownUploadedFileTypes = (fileExt: string) => {
		if (!knownUploadedFileTypes[fileExt]) {
			setKnownUploadedFileTypes({
				...knownUploadedFileTypes,
				[fileExt]: `.${fileExt}`,
			});
		}
	};

	const handleResetFileData = () => {
		resetFileData();
		setKnownUploadedFileTypes({});
	};

	useEffect(() => {
		setFilteredOutputTypes(
			fileTypes.map((fileType) => {
				if (knownUploadedFileTypes[fileType.id]) {
					return {
						...fileType,
						unavailable: true,
					};
				} else {
					return fileType;
				}
			})
		);
	}, [knownUploadedFileTypes]);

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
				<div className="shadow sm:rounded-md">
					<div className="space-y-6 bg-white px-4 py-3 sm:p-6">
						<div className="bg-gray-50 px-0 py-5 mb-8 sm:px-6">
							<div className="w-full flex flex-col md:flex-row md:items-center justify-center md:justify-between mt-4 lg:mt-auto">
								<div className="mt-4 md:my-auto flex-inline space-x-2">
									<ConvertToDropdown
										inputList={filteredOutputTypes}
										selectedInput={selectedOutputType}
										handleSelectedInput={setSelectedOutputType}
									/>
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
										onClick={handleResetFileData}
										className={`${
											!isDownloadDisabled
												? "cursor-pointer bg-white hover:bg-gray-200"
												: "cursor-not-allowed bg-gray-200 "
										} rounded-lg flex-initial ml-3 px-2 py-2.5 text-sm font-medium text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300`}
									>
										Clear <span className="hidden md:inline">photos</span>
									</button>
								</div>
							</div>
						</div>

						<UppyDashboard
							uppy={uppy}
							onUpload={onUpload}
							updateKnownUploadedFileTypes={handleknownUploadedFileTypes}
							restrictions={{
								maxTotalFileSize: MaxFileSize.free,
								maxNumberOfFiles: 10,
								allowedFileTypes: ["image/*", ".heif", ".heic"],
							}}
							conversionParams={{
								convertToFormat: selectedOutputType.id as string,
								imageQuality: settings.imageQuality,
							}}
						/>
					</div>
					<p className="py-2 text-center text-sm text-grey-500 bg-white">
						Total image upload size limited to max of{" "}
						{prettyBytes(MaxFileSize.free)}
					</p>
				</div>
			</div>
			<SettingsModal
				isOpen={settingsModalOpen}
				setIsOpen={setSettingsModalOpen}
			/>
		</div>
	);
}

export default FileUploader;
