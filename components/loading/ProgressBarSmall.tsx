import React from "react";

const getProgressString = (progress) => {
	if (progress >= 100) {
		return "100%";
	}
	return `${progress}%`;
};

function ProgressBarSmall({
	title,
	progress,
}: {
	title: string;
	progress: number;
}) {
	return (
		<div className="mt-4">
			<div className="flex justify-between mb-1">
				<span className="text-base font-medium text-sky-700 dark:text-sky">
					{title}
				</span>
				<span className="text-sm font-medium text-sky-700 dark:text-sky">
					{getProgressString(progress)}
				</span>
			</div>
			<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
				<div
					className="bg-pink-600 h-2.5 rounded-full"
					style={{ width: getProgressString(progress) }}
				/>
			</div>
		</div>
	);
}

export default ProgressBarSmall;
