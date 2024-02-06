import prettyBytes from "pretty-bytes";

import { ImageFile, UPLOAD_ORIGINS, AdditionalInfo } from "@/types/index";
import { DropboxChooserFile } from "@/types/api";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export function getServerUrl() {
	const serverUrl = process.env.NEXT_PUBLIC_SSE_URL;
	if (!serverUrl) throw new Error("Error: Server url is not set");
	return serverUrl;
}

export function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

interface ClientImagePayload {
	previewlUrl: string;
	downloadUrl: string;
	filename: string;
	fileId: string;
	fileType: string;
	elapsedTime: string;
	metadata: any;
	additionalInfo?: AdditionalInfo;
}

export const generateClientImage = (
	payload: ClientImagePayload,
	userKeptMetadata = false
): ImageFile => {
	let creationDate = null;
	let lastModifiedDate = null;

	if (userKeptMetadata) {
		creationDate = payload.metadata.creationDate;
		lastModifiedDate = payload.metadata.lastModifiedDate;
	} else {
		creationDate = new Date().toDateString();
		lastModifiedDate = new Date().toDateString();
	}

	let uploadedFrom = UPLOAD_ORIGINS.localStorage;
	if (payload.additionalInfo && payload.additionalInfo.uploadOrigin) {
		uploadedFrom = payload.additionalInfo.uploadOrigin;
	}

	return {
		id: payload.fileId,
		name: payload.filename,
		size: prettyBytes(payload.metadata.fileSize),
		current: false,
		progress: 100,
		source: payload.previewlUrl,
		downloadUrl: payload.downloadUrl,
		type: payload.fileType,
		information: {
			Filename: payload.filename,
			Type: payload.metadata.type,
			"Conversion time": `${payload.elapsedTime}ms`,
			Created: creationDate,
			"Last modified": lastModifiedDate,
			"Uploaded from": uploadedFrom,
			"Image Quality": `${payload.additionalInfo?.imageQuality}%` || "100%",
		},
	};
};

// Create an inital object for displaying images
export const generateInitialClientImage = (
	file: File,
	fileId: string,
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
		id: fileId,
		name: file.name,
		size: file.size,
		type: file.type,
		current: false,
		source: null, // initial source is null
		progress: 0, // initial progress is 0
		downloadUrl: null, // initial download url is null
		information: {
			"Uploaded from": uploadedFrom,
			// "File path": additionalInfo ? additionalInfo?.filePath : "N/A",
		}, // initial information is an empty object
	};
};

/**
 * Convert dropbox files to browser files that can be sent to our image server.
 * @more https://www.dropbox.com/developers/chooser
 * @param dropboxFiles
 * @returns
 */
export const convertToBrowserFileObjects = async (
	dropboxFiles: DropboxChooserFile[]
): Promise<File[]> => {
	const filePromises = dropboxFiles.map(async (dropboxFile) => {
		const response = await fetch(dropboxFile.link);
		const fileData = await response.blob();
		return new File([fileData], dropboxFile.name, { type: fileData.type });
	});

	return Promise.all(filePromises);
};

export const compressAndSaveImages = async (images: ImageFile[]) => {
	const zip = new JSZip();

	// Add each image to the zip file
	const loadImagePromises = images.map(async (image) => {
		const response = await fetch(image.downloadUrl);
		const blob = await response.blob();
		zip.file(image.name, blob);
	});

	// Wait for all images to be added to the zip file
	await Promise.all(loadImagePromises);

	// Generate and download the zip file
	const content = await zip.generateAsync({ type: "blob" });
	const currentDate = new Date()
		.toDateString()
		.toLowerCase()
		.replace(/ /g, "-");
	saveAs(content, `swift-convert-${currentDate}.zip`);
};

export function base64ToArrayBuffer(base64: string) {
	const binaryString = window.atob(base64);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes.buffer;
}