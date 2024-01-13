import React from "react";
import { classNames } from "../utils";

function ImageCard({
	file,
	updateCurrentFile,
}: {
	file: any;
	updateCurrentFile: (file) => void;
}) {
	return (
		<div>
			<div
				className={classNames(
					file.current
						? "ring-2 ring-indigo-500 ring-offset-2"
						: "focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100",
					"aspect-w-10 aspect-h-7 group block w-full overflow-hidden rounded-lg bg-gray-100"
				)}
			>
				<img
					src={file.source}
					alt={file.name}
					className={classNames(
						file.current ? "" : "group-hover:opacity-75",
						"pointer-events-none object-cover"
					)}
					style={{ imageOrientation: "from-image" }}
				/>
				<button
					onClick={() => updateCurrentFile(file)}
					type="button"
					className="absolute inset-0 focus:outline-none"
				>
					<span className="sr-only">View details for {file.name}</span>
				</button>
			</div>
			<p className="pointer-events-none mt-2 block truncate text-base font-medium text-gray-900">
				{file.name}
			</p>
			<p className="pointer-events-none block text-sm font-medium text-gray-700">
				{file.size}
			</p>
		</div>
	);
}

export default ImageCard;
