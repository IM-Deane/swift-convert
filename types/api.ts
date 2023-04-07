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
