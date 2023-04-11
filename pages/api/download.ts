import { Dropbox, Error, sharing } from "dropbox"; // eslint-disable-line no-unused-vars
import type { FileDownloadResult } from "types/api";

export const config = {
	api: {
		responseLimit: "10MB", // default is "4mb"
	},
};

const Handler = async (req, res) => {
	if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

	const { imageURL } = req.body;
	if (!imageURL) return res.status(400).send("No Image Provided");

	try {
		// res.setHeader("Content-Type", "image/heic");
		// use a switch statement to check the origin of imageURL. If it's from dropbox, then we start the dropbox flow. If it's from Google then we start the GoogleDrive flow
		if (imageURL.startsWith("https://www.dropbox.com/s/")) {
			// TODO: this is jsut for testing. Eventually, we need to use OAuth to login
			const dropbox = new Dropbox({
				accessToken: process.env.DROPBOX_ACCESS_TOKEN,
			});

			const linkResponse = await dropbox.sharingGetSharedLinkFile({
				url: imageURL,
			});
			if (linkResponse.status !== 200)
				return res.status(linkResponse.status).send(linkResponse.result);

			const downloadResponse = await dropbox.filesDownload({
				path: linkResponse.result.path_lower,
			});
			console.log(downloadResponse);
			if (downloadResponse.status !== 200)
				return res
					.status(downloadResponse.status)
					.send(downloadResponse.result);
			if (!downloadResponse.result.is_downloadable)
				throw new Error(
					"The image is not downloadable. Update it's permissions and try again."
				);

			const fileData: FileDownloadResult = {
				fileBinary: (<any>downloadResponse.result).fileBinary, // fileBinary needs to be injected
				id: downloadResponse.result.id,
				name: downloadResponse.result.name,
				path_display: downloadResponse.result.path_display,
				size: downloadResponse.result.size,
			};

			res.status(200).send(fileData);
			return;
		} else if (imageURL.startsWith("https://drive.google.com/")) {
			// TODO: implement GoogleDrive flow
			res.status(200).send("Success");
		} else {
			return res.status(400).send("Invalid Image URL");
		}
	} catch (error: unknown) {
		console.log(error);
		res.status(500).send("error", error);
	}
};

export default Handler;
