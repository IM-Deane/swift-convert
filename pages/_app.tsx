import "@/styles/globals.css";

import { useEffect } from "react";
import { useRouter } from "next/router";

import * as Fathom from "fathom-client";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

import { SettingsProvider } from "@/context/SettingsProvider";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	const router = useRouter();

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

	return (
		<>
			<SessionProvider session={session}>
				<SettingsProvider>
					<Toaster />
					<Component {...pageProps} />
				</SettingsProvider>
			</SessionProvider>
		</>
	);
}
