const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
	staticPageGenerationTimeout: 300,
	images: {
		domains: [
			"tailwindui.com",
			"images.unsplash.com",
			"heic-converter.onrender.com",
		],
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	sentry: {
		hideSourceMaps: true,
	},
};

const sentryWebpackPluginOptions = {
	silent: true,
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
