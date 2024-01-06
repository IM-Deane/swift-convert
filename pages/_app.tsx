import "@/styles/globals.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import * as Fathom from "fathom-client";
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
	const router = useRouter();
	const { settings } = useSettingsContext();

	const [uppy] = useState(
		createUppyWithTusUploader({
			maxTotalFileSize: MaxFileSize.free,
		})
	);

	useEffect(() => {
		// Initialize Fathom when the app loads
		//  - Do not include https://
		//  - This must be an exact match of your domain.
		//  - If you're using www. for your domain, make sure you include that here.
		Fathom.load("ALZOFJAF", {
			includedDomains: ["swiftconvert.io", "www.swiftconvert.io"],
		});

		function onRouteChangeComplete() {
			Fathom.trackPageview();
		}
		// Record a pageview when route changes
		router.events.on("routeChangeComplete", onRouteChangeComplete);

		return () => {
			router.events.off("routeChangeComplete", onRouteChangeComplete);
		};
	}, [router.events]);

	if (
		!settings ||
		settings.fileInputId === undefined ||
		settings.imageQuality === undefined
	) {
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
