import { siteConfig } from "@/types/site-config";
import { PhotoIcon } from "@heroicons/react/24/outline";

import logo from "./public/swift-convert.svg";

const domainName = process.env.NEXT_PUBLIC_DOMAIN_NAME;

export default siteConfig({
	siteName: "SwiftConvert",
	productBrand: logo,
	domain: domainName,
	developer: "Alchemized Software Ltd.",
	contactEmail: "hello@alchemizedsoftware.com",

	slogan: "SwiftConvert: Free, fast, and flawless HEIC conversions",
	description:
		"SwiftConvert is the free and fast solution for converting HEIC photos without sacrificing quality. Our tool ensures flawless and lightning-speed conversions, so you can easily share your photos without any hassle. Try SwiftConvert today and experience the convenience of hassle-free photo conversions.",

	mainNavTabs: [{ name: "Photos", href: "/", icon: PhotoIcon, current: true }],
	redirectUrls: {
		dropbox: "http://localhost:3000/api/auth/callback/dropbox",
		google: "http://localhost:3000/api/auth/callback/google",
	},

	// NOTE: make sure you get the feature ID from Notion otherwise it won't register
	// as of April 15, 2023 it's a multi_select field
	/*
	 */
	featureDiscovery: {
		emailImageResults: {
			id: "{fw=",
			name: "Email Images",
			description: "Send an email containing your converted photos",
		},
		googleDriveImports: {
			id: "g[X`",
			name: "Google Drive Import",
			description: "Import your photos from Google Drive",
		},
	},
});
