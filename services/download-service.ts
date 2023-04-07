import axios, { AxiosResponse } from "axios";

class DownloadService {
	private service: any;

	constructor() {
		this.service = axios.create({
			baseURL: "/api",
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	/**
	 * Used to download a file from a public Dropbox or Google Drive folder.
	 */
	downloadPublicFile = async (imageURL: string): Promise<AxiosResponse> => {
		if (!imageURL) return;
		return this.service.post("/download", { imageURL: imageURL });
	};
}

const downloadService = new DownloadService();
export default downloadService;
