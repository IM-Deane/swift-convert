import prettyBytes from "pretty-bytes";

import { ImageFile, UPLOAD_ORIGINS, AdditionalInfo } from "@/types/index";

export function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export const generateClientImage = (
	rawImageData: Uint8Array,
	filename: string,
	filetype: string,
	elapsedTime: string,
	additionalInfo?: AdditionalInfo
): ImageFile => {
	const imageType = `image/${filetype}`;
	const imageBlob = new Blob([rawImageData], { type: imageType });
	const newImageFile = new File([imageBlob], filename, {
		type: imageType,
	});
	const imageURL = URL.createObjectURL(newImageFile);

	let uploadedFrom = UPLOAD_ORIGINS.localStorage;
	if (additionalInfo && additionalInfo.uploadOrigin) {
		uploadedFrom = additionalInfo.uploadOrigin;
	}

	return {
		name: newImageFile.name,
		size: prettyBytes(newImageFile.size),
		current: false,
		progress: 100,
		source: imageURL,
		type: imageType,
		information: {
			Filename: newImageFile.name,
			Type: imageType,
			"Elapsed time": elapsedTime,
			Created: new Date(newImageFile.lastModified).toDateString(),
			"Last modified": new Date(newImageFile.lastModified).toDateString(),
			"Uploaded from": uploadedFrom,
			"File path": additionalInfo ? additionalInfo?.filePath : "N/A",
		},
	};
};

// Create an inital object for displaying images
export const generateInitialClientImage = (
	file: File,
	additionalInfo?: {
		uploadOrigin: UPLOAD_ORIGINS;
		filePath?: string;
	}
): ImageFile => {
	let uploadedFrom = UPLOAD_ORIGINS.localStorage;
	if (additionalInfo && additionalInfo.uploadOrigin) {
		uploadedFrom = additionalInfo.uploadOrigin;
	}

	return {
		id: 0,
		name: file.name,
		size: file.size,
		type: file.type,
		current: false,
		source: null, // initial source is null
		progress: 0, // initial progress is 0
		information: {
			"Uploaded from": uploadedFrom,
			"File path": additionalInfo ? additionalInfo?.filePath : "N/A",
		}, // initial information is an empty object
	};
};
