import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import { Dashboard } from "@uppy/react";
import { useState } from "react";
import prettyBytes from "pretty-bytes";

import { MaxFileSize } from "../types";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

interface ConversionParameters {
	convertToFormat?: string;
	imageQuality?: number;
}

export function createUppyWithTusUploader(
	restrictions,
	conversionParams: ConversionParameters
) {
	const serverUrl = process.env.NEXT_PUBLIC_SSE_URL;
	if (!serverUrl) throw new Error("Error: Server url is not set");

	const uppy = new Uppy({
		restrictions,
	}).use(Tus, {
		endpoint: `${serverUrl}/api/uploads`,
	});

	uppy.on("upload-success", async (file, response) => {
		const conversionUrl = `${serverUrl}/api/v2/convert`;
		const conversionResponse = await fetch(conversionUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				fileId: response.uploadURL.split("/").pop(),
				convertToFormat: conversionParams.convertToFormat,
				imageQuality: conversionParams.imageQuality,
			}),
		});
		try {
			const data = await conversionResponse.json();
			// TODO: add file to list of converted files
			console.log("Conversion successful for", file.name, data);
		} catch (error: any) {
			console.error("Conversion failed for", file.name, error);
		}
	});

	return uppy;
}

interface DashboardProps {
	queryParameters?: {
		convertToFormat?: string;
		imageQuality?: number;
	};
	restrictions?: {
		maxNumberOfFiles?: number;
		maxFileSize?: number;
		allowedFileTypes?: string[];
		maxTotalFileSize?: number;
	};
}

export default function UppyDashboard({
	restrictions,
	queryParameters,
}: DashboardProps): JSX.Element {
	const [uppy] = useState(
		createUppyWithTusUploader(restrictions, queryParameters)
	);

	return (
		<Dashboard
			id="dashboard"
			uppy={uppy}
			theme="light"
			width="100%"
			note={`Image of up to ${prettyBytes(MaxFileSize.free)}`}
			showProgressDetails={true}
			proudlyDisplayPoweredByUppy={false}
		/>
	);
}
