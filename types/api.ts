export interface FileDownloadResult {
	fileBinary: {
		type: string;
		data: ArrayBuffer;
	};
	id: string;
	name: string;
	path_display: string;
	size: number;
}

export interface ImageResult {
	filename: string;
	data: Uint8Array[];
	error: string;
}

export interface DropboxChooserFile {
	bytes: number;
	icon: string;
	id: string;
	isDir: boolean;
	link: string;
	linkType: string;
	name: string;
	thumbnailLink: string;
}
