import { useState, useCallback } from "react";

import { useSettingsContext } from "@/context/SettingsProvider";
import { FileType } from "@/types/index";

const useImageResults = () => {
	const [imageResults, setImageResults] = useState([]);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [completionTime, setCompletionTime] = useState(null);

	const { settings } = useSettingsContext();

	const updateImageResults = useCallback(
		(filename: string, progress: number) => {
			setImageResults((prevImageResults) =>
				prevImageResults.map((result) =>
					result.name === filename ? { ...result, progress } : result
				)
			);
		},
		[]
	);

	const uploadFilesToServer = async (files) => {
		setIsLoading(true);
		const convertToFormat = FileType[settings.fileOutputId];
		const SERVER_URL = `${process.env.NEXT_PUBLIC_SSE_URL}/api/convert?format=${convertToFormat}`;

		const formData = new FormData();
		files.forEach((file) => {
			formData.append("file", file);
		});
		formData.append("format", convertToFormat);

		const eventSource = new EventSource(SERVER_URL);
		console.log(eventSource);

		eventSource.onmessage = (event) => {
			const result = JSON.parse(event.data);
			const { fileId, progress } = result;

			updateImageResults(fileId, progress);

			if (progress === 100) {
				console.log(`File ${fileId} completed`);
			}
		};

		eventSource.onerror = (error) => {
			console.error("EventSource error:", error);
		};

		try {
			const response = await fetch(SERVER_URL, {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				console.log("Files uploaded successfully");
			} else {
				console.error("Error uploading files:", response.statusText);
			}
		} catch (error) {
			console.error("Error uploading files:", error);
		} finally {
			setIsLoading(false);
			eventSource.close();
		}
	};

	return {
		imageResults,
		setImageResults,
		selectedFiles,
		setSelectedFiles,
		isLoading,
		setIsLoading,
		uploadFilesToServer,
		completionTime,
		setCompletionTime,
	};
};

export default useImageResults;
