import "@/styles/globals.css";

import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";

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
					<Component {...pageProps} />
					<Analytics />
				</SettingsProvider>
			</SessionProvider>
		</>
	);
}
