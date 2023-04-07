import { LoadingImage } from "@/types/index";
import { classNames } from "@/utils/index";
import React from "react";

function LoadingCardGallery({
	loadingImageList,
}: {
	loadingImageList: LoadingImage[];
}) {
	return (
		<ul
			role="list"
			className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
		>
			{loadingImageList.map((file) => (
				<li key={file.name} className="relative">
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
							alt=""
							className={classNames(
								file.current ? "" : "group-hover:opacity-75",
								"pointer-events-none object-cover"
							)}
						/>
						<button
							type="button"
							className="absolute inset-0 focus:outline-none"
						>
							<span className="sr-only">View details for {file.name}</span>
						</button>
					</div>
					<p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
						{file.name}
					</p>
					<p className="pointer-events-none block text-sm font-medium text-gray-500">
						{file.size}
					</p>
				</li>
			))}
		</ul>
	);
}

export default LoadingCardGallery;
