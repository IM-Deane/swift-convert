import { FileType } from "@/types/index";

class UploadService {
	private serverURL: string;

	constructor() {
		this.serverURL = process.env.NEXT_PUBLIC_SSE_URL;
	}

	getServerURL(): string {
		return this.serverURL;
	}

	setServerURL(url: string): string {
		this.serverURL = url;
		return this.serverURL;
	}

	bulkUploadImages = async (
		files: File[],
		convertToFormat: FileType
	): Promise<Response> => {
		const formData = new FormData();

		files.forEach((file) => {
			formData.append("file", file);
		});

		return await fetch(
			`${this.serverURL}/api/convert?format=${convertToFormat}`,
			{
				method: "POST",
				body: formData,
			}
		);
	};
}

const uploadInstance = new UploadService();
export default uploadInstance;
