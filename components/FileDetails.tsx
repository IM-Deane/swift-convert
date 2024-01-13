import React from "react";
import Image from "next/image";

import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

import siteConfig from "site.config";

function FileDetails({
	currentFile,
	updateCurrentFile,
	handleDeleteImage,
	handleOpenWaitListModal,
}) {
	return (
		<aside className="w-96 h-full overflow-y-auto border-l border-gray-200 bg-white p-8 lg:block">
			<div className="space-y-6 pb-12">
				<div>
					<div className="float-right mt-0 mb-2 sm:block">
						<button
							type="button"
							className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							onClick={() => updateCurrentFile(null)}
						>
							<span className="sr-only">Close</span>
							<XMarkIcon className="h-8 w-8" aria-hidden="true" />
						</button>
					</div>

					<div className="relative aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg">
						<Image
							src={currentFile.source}
							alt={currentFile.name}
							fill
							className="object-cover"
						/>
					</div>
					<div className="mt-4 flex items-start justify-between">
						<div>
							<h2 className="text-lg font-medium text-gray-900">
								<span className="sr-only">Details for </span>
								{currentFile.name}
							</h2>
							<p className="text-sm font-medium text-gray-500">
								{currentFile.size}
							</p>
						</div>
						<button
							type="button"
							onClick={() =>
								handleOpenWaitListModal(
									siteConfig.featureDiscovery.emailImageResults.id
								)
							}
							className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						>
							<PaperAirplaneIcon className="h-6 w-6" aria-hidden="true" />
							<span className="sr-only">Send an email</span>
						</button>
					</div>
				</div>
				<div>
					<h3 className="font-medium text-gray-900">Information</h3>
					<dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
						{Object.keys(currentFile.information).map((key) => (
							<div
								key={key}
								className="flex justify-between py-3 text-sm font-medium"
							>
								<dt className="text-gray-500">{key}</dt>
								<dd
									className={`${
										key === "Filename" ? "pl-4 truncate" : "whitespace-nowrap"
									} text-gray-900"`}
								>
									{currentFile.information[key]}
								</dd>
							</div>
						))}
					</dl>
				</div>
				<div className="flex gap-x-3">
					<a
						type="button"
						download={currentFile.name}
						href={currentFile.source}
						title={currentFile.name}
						className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm text-center font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
					>
						Download
					</a>
					<button
						type="button"
						onClick={handleDeleteImage}
						className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
					>
						Delete
					</button>
				</div>
			</div>
		</aside>
	);
}

export default FileDetails;
