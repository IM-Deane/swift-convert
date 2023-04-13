import { dropbox } from "@/utils/dropbox-sdk";

const DropboxHandler = async (req, res) => {
	try {
		const { code } = req.query;
		const response = new Promise((resolve) => {
			dropbox.getToken(code, (error, response) => {
				if (error) throw error;

				console.log("access_token: ", response.access_token);
				console.log("refresh_token: ", response.refresh_token);
				// get user account info
				dropbox(
					{
						resource: "users/get_current_account",
					},
					function (err, response) {
						console.log(err);
						resolve(response);
					}
				);
				//  get refresh token
				dropbox.refreshToken(response.refresh_token, (error, result) => {
					if (error) throw error;
					console.log(result);
				});
			});
		});

		res.status(200).send(response);
	} catch (error: unknown) {
		res.status(500).send(error);
	}
};

export default DropboxHandler;
