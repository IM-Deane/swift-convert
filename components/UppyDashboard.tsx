import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import { Dashboard } from "@uppy/react";
import { useEffect } from "react";
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
	uppy: Uppy;
	onUpload: (imageData, elapsedTime) => void;
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
	uppy,
	onUpload,
	restrictions,
	conversionParams,
}: DashboardProps): JSX.Element {
	useEffect(() => {
		uppy.setOptions({ restrictions: { ...restrictions } });

		uppy.on("upload-success", async (file, response) => {
			const serverUrl = getServerUrl();
			const conversionUrl = `${serverUrl}/api/v2/convert`;
			try {
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
				const elapsedTime = conversionResponse.headers.get("Server-Timing");
				const data = await conversionResponse.json();
				onUpload(data, elapsedTime);
			} catch (error: any) {
				console.error("Conversion failed for", file.name, error);
			}
		});

		uppy.on("complete", () => {
			// hack to change the title of the dashboard after conversion is complete
			document.getElementsByClassName(
				"uppy-DashboardContent-title"
			)[0].textContent = "Conversion complete";
		});
	}, [uppy, restrictions, conversionParams, onUpload]);

	return (
		<Dashboard
			id="dashboard"
			uppy={uppy}
			theme="light"
			width="100%"
			height="200px"
			showProgressDetails={true}
			proudlyDisplayPoweredByUppy={false}
			locale={{
				strings: getUppyStatusBarProps(),
			}}
		/>
	);
}

/**
 * Handles the text shown in the status bar of the Uppy dashboard.
 * @more https://uppy.io/docs/status-bar/#locale
 */
function getUppyStatusBarProps() {
	const isDeviceWidthSmall = window.innerWidth < 640;

	return {
		// Shown in the status bar while files are being uploaded.
		uploading: "Converting",
		// Shown in the status bar if an upload failed.
		uploadFailed: "Conversion failed",
		// When `showProgressDetails` is set, shows the number of files that have been fully uploaded so far.
		filesUploadedOfTotal: {
			0: "%{complete} of %{smart_count} file converted",
			1: "%{complete} of %{smart_count} files converted",
		},
		uploadXFiles: {
			0: "Convert %{smart_count} file",
			1: "Convert %{smart_count} files",
		},
		// Used as the label for the button that starts an upload, if another upload has been started in the past
		// and new files were added later.
		uploadXNewFiles: {
			0: "Convert +%{smart_count} file",
			1: "Convert +%{smart_count} files",
		},
		upload: "Convert",
		retryUpload: "Retry convert",
		xMoreFilesAdded: {
			0: "%{smart_count} more file added",
			1: "%{smart_count} more files added",
		},
		// Text to show on the droppable area.
		// `%{browse}` is replaced with a link that opens the system file selection dialog.
		dropPasteFiles: `${
			isDeviceWidthSmall
				? "%{browseFiles}"
				: "Drag and drop photos here or %{browseFiles}"
		}`,
		// Used as the label for the link that opens the system file selection dialog.
		browseFiles: `${isDeviceWidthSmall ? "Upload" : "upload"} from device`,
	};
}
