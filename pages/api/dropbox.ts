import { getServerSession } from "next-auth/next";
import authOptions from "./auth/[...nextauth]";

const DropboxHandler = async (req, res) => {
	try {
		const session = await getServerSession(req, res, authOptions);
		if (!session) {
			res.status(403).send({
				error: "You must be signed in to view this page",
			});
			return;
		}
	} catch (error: unknown) {
		res.status(500).send(error);
	}
};

export default DropboxHandler;
