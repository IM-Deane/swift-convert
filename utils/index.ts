import prettyBytes from "pretty-bytes";

export function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export const generateClientImage = (
	rawImageData: Uint8Array,
	filename: string,
	filetype: string,
	elapsedTime: string
) => {
	const imageType = `image/${filetype}`;
	const imageBlob = new Blob([rawImageData], { type: imageType });
	const newImageFile = new File([imageBlob], filename, {
		type: imageType,
	});
	const imageURL = URL.createObjectURL(newImageFile);

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
		},
	};
};
