import { useAuth } from "@clerk/nextjs";

interface FetchArgs {
	url: string;
	method?: string;
	body?: any;
	contentType?: string;
}

export default function useFetch() {
	const { getToken } = useAuth();

	const authenticatedFetch = async ({
		url,
		method,
		body,
		contentType,
	}: FetchArgs) => {
		return fetch(url, {
			method: method || "GET",
			headers: {
				Authorization: `Bearer ${await getToken()}`,
				"Content-Type": contentType ? contentType : "application/json",
			},
			body: body ? JSON.stringify(body) : undefined,
		}).then((res) => res.json());
	};

	return authenticatedFetch;
}
