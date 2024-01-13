import React, { useMemo, useState } from "react";

import type Uppy from "@uppy/core";
import prettyBytes from "pretty-bytes";

import { useSettingsContext } from "@/context/SettingsProvider";
import UppyDashboard from "./UppyDashboard";
import ConvertToDropdown from "./ConvertToDropdown";
import ImageSlider from "./ImageSilder";

import { FileType, Input, MaxFileSize, fileTypes } from "@/types/index";

const MAX_FILE_SIZE = MaxFileSize.standard;

function FileUploader({ uppy }: { uppy: Uppy }) {
	const {
		settings,
		updateSettings,
		knownUploadedFileTypes,
		handleknownUploadedFileTypes,
	} = useSettingsContext();

	const initialOutputType =
		fileTypes.find((ft) => ft.id === settings.fileOutputId) || fileTypes[0];
	const [selectedOutputType, setSelectedOutputType] =
		useState<Input>(initialOutputType);

	const handleOutputTypeChange = (outputType: Input) => {
		setSelectedOutputType(outputType);
		updateSettings({ ...settings, fileOutputId: outputType.id });
	};

	const { computedFilteredOutputTypes, allowedFileTypes } = useMemo(() => {
		const outputTypes = fileTypes.reduce((acc, fileType) => {
			if (fileType.id !== FileType.heic && fileType.id !== FileType.heif) {
				acc.push({
					...fileType,
					unavailable: knownUploadedFileTypes.hasOwnProperty(fileType.id),
				});
			}
			return acc;
		}, []);

		const allowedTypes = outputTypes.reduce((acc, { name }) => {
			if (name.toLowerCase() !== selectedOutputType.name.toLowerCase()) {
				acc.push(name.toLowerCase());
			}
			return acc;
		}, []);

		return {
			computedFilteredOutputTypes: outputTypes,
			allowedFileTypes: allowedTypes,
		};
	}, [knownUploadedFileTypes, selectedOutputType]);

	const restrictions = {
		maxTotalFileSize: MAX_FILE_SIZE,
		maxNumberOfFiles: 5,
		allowedFileTypes: [...allowedFileTypes, ".heic", ".heif"],
	};

	if (!settings || settings.imageQuality === undefined) {
		return <div>Loading...</div>;
	}

	return (
		<div className="mt-2">
			<div className="mt-5 md:col-span-2 md:mt-0">
				<div className="shadow sm:rounded-md">
					<div className="space-y-6 bg-white px-4 py-3 sm:p-6">
						<div className="bg-gray-50 px-3 py-5 mb-8 sm:px-6">
							<h2 className="text-base font-semibold leading-6 text-gray-900 mb-4">
								Output Settings
							</h2>
							<div className="w-full flex flex-col md:flex-row md:items-center justify-center md:justify-between mt-4 lg:mt-auto">
								<div className="w-full flex flex-col items-start justify-around md:items-center md:flex-row md:justify-start space-y-4 md:space-y-0 md:space-x-2 mt-4 md:my-auto">
									<ConvertToDropdown
										inputList={computedFilteredOutputTypes}
										selectedInput={selectedOutputType}
										handleSelectedInput={handleOutputTypeChange}
									/>
									<ImageSlider />
								</div>
							</div>
						</div>
						<UppyDashboard
							uppy={uppy}
							updateKnownUploadedFileTypes={handleknownUploadedFileTypes}
							restrictions={restrictions}
						/>
					</div>
					<p className="py-2 text-center text-sm text-grey-500 bg-white">
						Total image upload size limited to max of{" "}
						{prettyBytes(MAX_FILE_SIZE)}
					</p>
				</div>
			</div>
		</div>
	);
}

export default FileUploader;
