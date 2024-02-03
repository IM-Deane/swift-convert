import { UserProfile } from "@clerk/nextjs";

import Layout from "@/components/Layout";

const UserProfilePage = () => (
	<Layout>
		<div className="m-4">
			<UserProfile path="/profile" routing="path" />
		</div>
	</Layout>
);

export default UserProfilePage;
