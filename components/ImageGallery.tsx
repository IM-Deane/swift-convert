import React from "react";
import { ImageFile } from "types";
import CardSkeleton from "./loading/CardSkeleton";
import ImageCard from "./ImageCard";

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
					{file.progress < 100 ? (
						<CardSkeleton imageTitle={file.name} progress={file.progress} />
					) : (
						<ImageCard file={file} updateCurrentFile={setCurrentFile} />
					)}
				</li>
			))}
		</ul>
	);
}

export default ImageGallery;
