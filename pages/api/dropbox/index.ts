import { dropbox } from "@/utils/dropbox-sdk";

const DropboxHandler = async (req, res) => {
	try {
		if (req.method === "GET") {
			const authURL = dropbox.generateAuthUrl();
			res.status(200).send(authURL);
			return;
		}
		res.status(405).send("Method Not Allowed");
	} catch (error: unknown) {
		res.status(500).send(error);
	}
};

export default DropboxHandler;
