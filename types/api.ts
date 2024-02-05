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

export interface WaitListBodyContents {
	featureId: string;
	name: string;
	email: string;
	isEarlyAdopter: boolean;
}

export enum Providers {
	Google = "oauth_google",
	Dropbox = "oauth_dropbox",
	Box = "oauth_box",
	OneDrive = "oauth_onedrive",
}
