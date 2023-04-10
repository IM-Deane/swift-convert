import React from "react";
import { classNames } from "utils";
import { ImageFile } from "types";
import CardSkeleton from "./loading/CardSkeleton";

function ImageGallery({
	imageFiles,
	setCurrentFile,
	progress,
}: {
	imageFiles: File[] | ImageFile[];
	setCurrentFile: (File) => void;
	progress: { [index: number]: number };
}) {
	return (
		<ul
			role="list"
			className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
		>
			{imageFiles.map((file, index) => {
				const ImageConversionProgress = progress[index] || 0;
				return (
					<li key={file.name.toLowerCase() + file.size} className="relative">
						{ImageConversionProgress < 100 ? (
							<CardSkeleton
								imageTitle={file.name}
								progress={ImageConversionProgress}
							/>
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
										<span className="sr-only">
											View details for {file.name}
										</span>
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
				);
			})}
		</ul>
	);
}

export default ImageGallery;
