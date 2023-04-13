import dropboxV2Api from "dropbox-v2-api";

/**
 * Warning: This should only be used in server-side code.
 * Importing this in the client will result in errors.
 */
export const dropbox = dropboxV2Api.authenticate({
	client_id: process.env.DROPBOX_CLIENT_ID,
	client_secret: process.env.DROPBOX_CLIENT_SECRET,
	token_access_type: "offline",
	redirect_uri: `${process.env.NEXTAUTH_URL}/api/dropbox/auth`,
});
