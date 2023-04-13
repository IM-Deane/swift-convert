import { dropbox } from "@/utils/dropbox-sdk";

const Handler = async (req, res) => {
	if (req.method !== "GET") return res.status(405).send("Method Not Allowed");

	try {
		const token = req.query.token;
		if (!token) return res.status(400).send("Missing token");
		if (!req.query.filepath) return res.status(400).send("Missing path");

		const downloadStream = dropbox({
			resource: "files/download",
			parameters: { path: req.query.filepath },
		});
		console.log(downloadStream);

		// await new Promise((resolve) => {
		// 	// res.writeHead(200, {
		// 	// 	"Content-Type": "image/mpeg",
		// 	// 	"Content-Length": stat.size,
		// 	// });

		// 	downloadStream.pipe(res);
		// 	downloadStream.on("end", resolve);
		// });

		res.status(200).send("success");
	} catch (error: unknown) {
		res.status(400).send(error);
	}
};

export default Handler;
