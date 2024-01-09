import React, { useEffect, useState } from "react";

import type Uppy from "@uppy/core";

import { useSettingsContext } from "@/context/SettingsProvider";
import UppyDashboard from "./UppyDashboard";
import SettingsModal from "./SettingsModal";
import ConvertToDropdown from "./ConvertToDropdown";
import ImageSlider from "./ImageSilder";

import { Input, MaxFileSize, fileTypes } from "@/types/index";
import prettyBytes from "pretty-bytes";

function FileUploader({
	uppy,
	onUpload,
}: {
	uppy: Uppy;
	onUpload: (imageData, elapsedTime) => void;
}) {
	const [settingsModalOpen, setSettingsModalOpen] = useState(false);
	const [selectedOutputType, setSelectedOutputType] = useState<Input>(
		fileTypes[0]
	);
	const [filteredOutputTypes, setFilteredOutputTypes] = useState<Input[]>([]);
	const [selectedImageQuality, setSelectedImageQuality] = useState(30);

	const { settings, knownUploadedFileTypes, handleknownUploadedFileTypes } =
		useSettingsContext();

	const handleImageQualityChange = (quality: number) => {
		setSelectedImageQuality(quality);
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
								<div className="w-full flex flex-col space-between lg:flex-row md:items-end md:justify-around space-y-4 md:space-y-0 md:space-x-2 mt-4 md:my-auto">
									<ConvertToDropdown
										inputList={filteredOutputTypes}
										selectedInput={selectedOutputType}
										handleSelectedInput={setSelectedOutputType}
									/>
									<ImageSlider onQualityChange={handleImageQualityChange} />
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
								imageQuality: selectedImageQuality,
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
