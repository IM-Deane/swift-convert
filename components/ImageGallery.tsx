import React from "react";
import { classNames } from "utils";
import { ImageFile } from "types";
import CardSkeleton from "./loading/CardSkeleton";

function ImageGallery({
	imageFiles,
	setCurrentFile,
}: {
	imageFiles: File[] | ImageFile[];
	setCurrentFile: (File) => void;
}) {
	return (
		<ul
			role="list"
			className="w-full grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8"
		>
			{imageFiles.map((file) => (
				<li key={file.name.toLowerCase() + file.size} className="relative">
					{file.progress < 100 && !file.source ? (
						<CardSkeleton imageTitle={file.name} progress={file.progress} />
					) : (
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
									onClick={() => setCurrentFile(file)}
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
					)}
				</li>
			))}
		</ul>
	);
}

export default ImageGallery;
