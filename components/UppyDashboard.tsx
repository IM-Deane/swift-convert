import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import { Dashboard } from "@uppy/react";
import { useEffect, useState } from "react";
import prettyBytes from "pretty-bytes";

import { MaxFileSize } from "../types";
import { getServerUrl } from "../utils";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

export function createUppyWithTusUploader(restrictions) {
	const serverUrl = getServerUrl();

	const uppy = new Uppy({
		restrictions,
	}).use(Tus, {
		endpoint: `${serverUrl}/api/uploads`,
	});

	return uppy;
}

interface DashboardProps {
	conversionParams?: {
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
	conversionParams,
}: DashboardProps): JSX.Element {
	const [uppy] = useState(createUppyWithTusUploader(restrictions));

	useEffect(() => {
		uppy.on("upload-success", async (file, response) => {
			const serverUrl = getServerUrl();

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

		return () => uppy.close();
	}, [uppy, conversionParams]);

	return (
		<Dashboard
			id="dashboard"
			uppy={uppy}
			theme="light"
			width="100%"
			note={`Each image size should be a maximum of ${prettyBytes(
				MaxFileSize.free
			)}`}
			showProgressDetails={true}
			proudlyDisplayPoweredByUppy={false}
		/>
	);
}
