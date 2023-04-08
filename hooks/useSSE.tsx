import { useEffect, useState } from "react";

const useSSE = (url: string) => {
	const [error, setError] = useState(null);
	const [progressMap, setProgressMap] = useState({});

	useEffect(() => {
		const source = new EventSource(url);

		// track the upload progress for each image in map
		source.onmessage = (event) => {
			const data = JSON.parse(event.data);
			setProgressMap((prev) => ({
				...prev,
				[data.Filename]: data.Progress,
			}));
		};

		source.onerror = (err) => {
			setError(err);
			source.close();
		};

		return () => {
			source.close();
		};
	}, [url]);

	return { progressMap, error };
};

export interface useSSEProps {
	url: string;
}

export default useSSE;
