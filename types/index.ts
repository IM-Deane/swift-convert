export interface Input {
	id: string;
	name: string;
	unavailable?: boolean;
}

export enum SettingsKeys {
	FILE_INPUT_TYPE = "fileInput",
	FILE_OUTPUT_TYPE = "fileOutput",
	IMAGE_QUALITY = "imageQuality",
}

export enum MaxSingleFileSize {
	free = 10500000, // 10.5mb
	standard = 25000000, // 25mb
	pro = 75000000, // 75mb
}

export enum MaxTotalUploadSize {
	free = 20500000, // 20.5MB
	standard = 75000000, // 50mb
	pro = 100000000, // 100mb
}

export enum FileType {
	heic = "heic",
	jpeg = "jpeg",
	jpg = "jpg",
	png = "png",
	webp = "webp",
	heif = "heif",
}

export const fileTypes: Input[] = [
	{ id: "jpeg", name: ".JPEG", unavailable: false },
	{ id: "png", name: ".PNG", unavailable: false },
	{ id: "heic", name: ".HEIC", unavailable: false },
	{ id: "heif", name: ".HEIF", unavailable: false },
	{ id: "jpg", name: ".JPG", unavailable: false },
	{ id: "webp", name: ".WEBP", unavailable: false },
];

export const settingsInputTypes: Input[] = [
	{ id: "heic", name: ".HEIC", unavailable: false },
	{ id: "jpeg", name: ".JPEG", unavailable: false },
	{ id: "png", name: ".PNG", unavailable: false },
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
