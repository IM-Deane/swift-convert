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
