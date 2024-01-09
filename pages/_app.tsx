import "@/styles/globals.css";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

import {
	SettingsProvider,
	useSettingsContext,
} from "@/context/SettingsProvider";
import { createUppyWithTusUploader } from "@/components/UppyDashboard";
import { MaxFileSize } from "../types";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	const { settings } = useSettingsContext();

	const [uppy] = useState(
		createUppyWithTusUploader({
			maxTotalFileSize: MaxFileSize.free,
		})
	);

	if (!settings) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<SessionProvider session={session}>
				<SettingsProvider>
					<Toaster />
					<Component {...pageProps} uppy={uppy} />
				</SettingsProvider>
			</SessionProvider>
		</>
	);
}
