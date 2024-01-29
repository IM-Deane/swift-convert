import "@/styles/globals.css";

import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

import {
	SettingsProvider,
	useSettingsContext,
} from "@/context/SettingsProvider";
import { createUppyWithTusUploader } from "@/components/UppyDashboard";
import { MaxSingleFileSize } from "../types";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useRouter } from "next/router";

if (typeof window !== "undefined") {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
		// Enable debug mode in development
		loaded: (posthog) => {
			if (process.env.NODE_ENV === "development") posthog.debug();
		},
	});
}

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	const router = useRouter();
	const { settings } = useSettingsContext();

	const [uppy] = useState(
		createUppyWithTusUploader({
			maxTotalFileSize: MaxSingleFileSize.free,
		})
	);

	useEffect(() => {
		const handleRouteChange = () => posthog?.capture("$pageview");
		router.events.on("routeChangeComplete", handleRouteChange);

		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [router.events]);

	useEffect(() => {
		return () => {
			if (uppy) uppy.close();
		};
	}, [uppy]);

	if (!settings) {
		return <div>Loading...</div>;
	}

	return (
		<PostHogProvider client={posthog}>
			<SessionProvider session={session}>
				<SettingsProvider>
					<Toaster />
					<Component {...pageProps} uppy={uppy} />
				</SettingsProvider>
			</SessionProvider>
		</PostHogProvider>
	);
}
