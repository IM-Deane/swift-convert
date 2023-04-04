module.exports = {
	staticPageGenerationTimeout: 300,
	images: {
		domains: [
			"tailwindui.com",
			"images.unsplash.com",
			"heic-converter.onrender.com",
		],
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};
