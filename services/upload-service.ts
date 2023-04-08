import axios, { AxiosResponse } from "axios";

import { FileType } from "@/types/index";

class UploadService {
	private service: any;

	constructor() {
		this.service = axios.create({
			baseURL: `${process.env.NEXT_PUBLIC_SSE_URL}/api`,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	newImage = async (
		file: File,
		convertToFormat: FileType
	): Promise<AxiosResponse> => {
		const formData = new FormData();
		formData.append("file", file);

		return this.service.post("/convert", formData, {
			params: {
				format: convertToFormat,
			},
			responseType: "blob",
		});
	};

	bulkUploadImages = async (
		files: File[],
		convertToFormat: FileType
	): Promise<AxiosResponse> => {
		const formData = new FormData();

		files.forEach((file, index) => {
			formData.append(`file${index}`, file);
		});

		return this.service.post("/convert", formData, {
			params: {
				format: convertToFormat,
			},
			responseType: "stream",
		});
	};
}

const uploadInstance = new UploadService();
export default uploadInstance;
