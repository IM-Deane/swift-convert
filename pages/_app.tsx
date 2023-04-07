import "@/styles/globals.css";
import Script from "next/script";

import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

import { SettingsProvider } from "@/context/SettingsProvider";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	return (
		<>
			<SessionProvider session={session}>
				<SettingsProvider>
					<Toaster />
					<Script
						type="text/javascript"
						src="https://www.dropbox.com/static/api/2/dropins.js"
						id="dropboxjs"
						data-app-key="0srlta70mx0izr1"
					/>

					<Component {...pageProps} />
				</SettingsProvider>
			</SessionProvider>
		</>
	);
}
