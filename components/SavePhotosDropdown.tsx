import { Fragment } from "react";

import { usePostHog } from "posthog-js/react";

import { Menu, Transition } from "@headlessui/react";
import {
	ArchiveBoxIcon,
	ArrowDownTrayIcon,
	ChevronDownIcon,
} from "@heroicons/react/20/solid";

import { classNames, compressAndSaveImages } from "../utils/index";

const DropdownOption = ({ icon, text, onClick }) => {
	return (
		<Menu.Item>
			{({ active }) => (
				<a
					type="button"
					onClick={onClick}
					className={classNames(
						active ? "bg-gray-100 text-gray-900" : "text-gray-700",
						"group flex items-center px-4 py-2 text-sm cursor-pointer"
					)}
				>
					{icon}
					{text}
				</a>
			)}
		</Menu.Item>
	);
};

export default function SavePhotosDropdown({
	imageResults,
	isDownloadDisabled = true,
}) {
	const posthog = usePostHog();

	const handleDownloadPhotos = async () => {
		try {
			const imagePromises = imageResults.map(async (image) => {
				const response = await fetch(image.downloadUrl);
				const blob = await response.blob();
				return {
					blob,
					name: image.name,
				};
			});

			const savedImageData = await Promise.all(imagePromises);
			console.log(savedImageData);
			await compressAndSaveImages(savedImageData);

			posthog.capture("download_all_images", {
				imageCount: savedImageData.length,
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button
					disabled={isDownloadDisabled}
					className={`${
						isDownloadDisabled
							? "cursor-not-allowed bg-gray-200"
							: "cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 flex-1 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					} text-white font-medium rounded-lg inline-flex max-w-36 items-center text-sm px-5 py-2.5 text-center inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2`}
				>
					Save Photos
					<ChevronDownIcon
						className={`-mr-1 h-5 w-5 text-gray-400 ${
							isDownloadDisabled ? "text-gray-300" : "text-white"
						}`}
						aria-hidden="true"
					/>
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<DropdownOption
							text="Save to Current Device"
							onClick={handleDownloadPhotos}
							icon={
								<ArrowDownTrayIcon
									className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
									aria-hidden="true"
								/>
							}
						/>
					</div>
					<div className="py-1">
						<DropdownOption
							text="Save to Google Drive"
							onClick={handleDownloadPhotos}
							icon={
								<ArchiveBoxIcon
									className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
									aria-hidden="true"
								/>
							}
						/>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
