export interface Input {
	id: string | number | FileType;
	name: string;
	unavailable?: boolean;
}

export enum SettingsKeys {
	FILE_INPUT_TYPE = "fileInput",
	FILE_OUTPUT_TYPE = "fileOutput",
	IMAGE_QUALITY = "imageQuality",
}

export enum FileType {
	heic = "heic",
	jpeg = "jpeg",
	png = "png",
}

export const fileTypes: Input[] = [
	{ id: "jpeg", name: ".JPEG", unavailable: false },
	{ id: "png", name: ".PNG", unavailable: false },
];

export const settingsInputTypes: Input[] = [
	{ id: "heic", name: ".HEIC", unavailable: false },
	{ id: "jpeg", name: ".JPEG", unavailable: true },
	{ id: "png", name: ".PNG", unavailable: true },
];

export interface UploadOption {
	id: number;
	name: string;
	icon: any;
	action: () => void;
}

export interface LoadingImage {
	imageTitle: string;
	progress: number;
}

export interface ImageFile {
	id?: number | string;
	name: string;
	current: boolean;
	source: string;
	size: number | string;
	type: string;
	progress: number; // used for progress bar
	information?: { [key: string]: string | number };
}

export enum UPLOAD_ORIGINS {
	googleDrive = "Google Drive",
	dropbox = "Dropbox",
	s3 = "S3",
	localStorage = "Current Device",
}

export interface AdditionalInfo {
	uploadOrigin?: UPLOAD_ORIGINS;
	filePath?: string;
	imageQuality?: number;
}
