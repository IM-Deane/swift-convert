import { FileType } from "@/types/index";

interface BulkImageUploadRequest {
	files: FormData;
	convertToFormat: string;
	imageQuality: number;
}

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
		request: BulkImageUploadRequest
	): Promise<Response> => {
		if (!request.files) {
			throw new Error("No files provided");
		} else if (!request.convertToFormat) {
			throw new Error("New image format must be provided");
		} else if (!Object.hasOwn(FileType, request.convertToFormat)) {
			throw new Error("Invalid image format provided");
		}

		const apiUrl =
			`${this.getServerURL()}/api/convert?` +
			new URLSearchParams({
				convertToFormat: request.convertToFormat,
				imageQuality: request.imageQuality.toString() || "85",
			});

		return await fetch(apiUrl, {
			method: "POST",
			body: request.files,
		});
	};
}

const uploadInstance = new UploadService();
export default uploadInstance;
