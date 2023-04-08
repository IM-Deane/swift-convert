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
