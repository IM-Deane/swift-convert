import { Fragment, useState } from "react";
import Image, { StaticImageData } from "next/image";

import { usePostHog } from "posthog-js/react";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

import { Providers } from "@/types/api";

import { Menu, Transition } from "@headlessui/react";
import { ArrowDownTrayIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

import { classNames, compressAndSaveImages } from "@/utils/index";
import Alert from "./Alert";

import GoogleDriveIcon from "../public/logos/google-drive-svgrepo-com.svg";

export const createOAuthTokenUrl = (userId: string, provider: string) => {
	if (!Object.values(Providers).includes(provider as Providers)) {
		throw new Error("Invalid provider");
	} else if (!userId) {
		throw new Error("Invalid user ID");
	}
	const apiUrl = `https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/${provider}`;
	return apiUrl;
};

const CustomIcon = ({
	src,
	alt,
	className = "mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500",
}: {
	src: StaticImageData | string;
	alt: string;
	className?: string;
}) => {
	return <Image src={src} alt={alt} className={className} />;
};

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
					<span className="flex-shrink-0 mr-3">{icon}</span>
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
	const [isSavingPhotos, setIsSavingPhotos] = useState<boolean>(false);

	const posthog = usePostHog();
	const { isLoaded, userId } = useAuth();

	const handleDownloadPhotos = async () => {
		try {
			await compressAndSaveImages(imageResults);

			posthog.capture("download_all_images", {
				imageCount: imageResults.length,
			});
		} catch (error) {
			console.error(error);
		}
	};

	const handleSaveToGoogleDrive = async () => {
		if (!isLoaded || !userId) {
			toast.custom((t) => (
				<div
					className={`${
						t.visible ? "animate-enter" : "animate-leave"
					} bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-4 max-w-sm w-full shadow-lg`}
				>
					<div className="flex items-center justify-between">
						<p className="font-bold text-lg">Sign in to save photos</p>
					</div>
				</div>
			));
		}
		setIsSavingPhotos(true);
		try {
			const files = imageResults.map((image) => {
				const fileData = {
					id: image.id,
					fileType: image.type,
				};
				return fileData;
			});
			const serverUrl = `${process.env.NEXT_PUBLIC_SSE_URL}/api/v1/export/google`;
			const response = await fetch(serverUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId, files }),
			});
			const data = await response.json();

			if (!data.success) throw new Error(data.error);
			const swiftConvertGoogleDriveFolder = data.swiftConvertfolderUrl;

			toast.custom(({ visible }) => (
				<Alert
					type="success"
					isOpen={visible}
					title="Files uploaded to Google Drive! 🎉"
					message={`You can view them in your Drive's "SwiftConvert" folder.`}
					link={{
						href: swiftConvertGoogleDriveFolder,
						text: "Open SwiftConvert Folder",
						isExternal: true,
					}}
				/>
			));

			posthog.capture("save_to_google_drive", {
				imageCount: imageResults.length,
			});
		} catch (error: any) {
			console.error(error);
			if (error.statusCode === 401) {
				toast.error("Please sign in to save photos to Google Drive");
			} else {
				toast.error(`Error saving photos to Google Drive: ${error.message}`);
			}
		} finally {
			setIsSavingPhotos(false);
		}
	};

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button
					disabled={isDownloadDisabled || isSavingPhotos}
					className={`${
						isDownloadDisabled
							? "cursor-not-allowed bg-gray-200"
							: "cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 flex-1 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					} text-white font-medium rounded-lg inline-flex max-w-42 items-center text-sm px-5 py-2.5 text-center inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2`}
				>
					{isSavingPhotos ? "Saving photos..." : "Save photos"}
					{!isSavingPhotos && (
						<ChevronDownIcon
							className={`-mr-1 h-5 w-5 ${
								isDownloadDisabled ? "text-gray-300" : "text-white"
							}`}
							aria-hidden="true"
						/>
					)}
					{isSavingPhotos && (
						<svg className="h-4 w-4 animate-spin" viewBox="3 3 18 18">
							<path
								className="fill-blue-800"
								d="M12 5C8.13401 5 5 8.13401 5 12c0 3.866 3.13401 7 7 7 3.866.0 7-3.134 7-7 0-3.86599-3.134-7-7-7zM3 12c0-4.97056 4.02944-9 9-9 4.9706.0 9 4.02944 9 9 0 4.9706-4.0294 9-9 9-4.97056.0-9-4.0294-9-9z"
							></path>
							<path
								className="fill-blue-100"
								d="M16.9497 7.05015c-2.7336-2.73367-7.16578-2.73367-9.89945.0-.39052.39052-1.02369.39052-1.41421.0-.39053-.39053-.39053-1.02369.0-1.41422 3.51472-3.51472 9.21316-3.51472 12.72796.0C18.7545 6.02646 18.7545 6.65962 18.364 7.05015c-.390599999999999.39052-1.0237.39052-1.4143.0z"
							></path>
						</svg>
					)}
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
							onClick={handleSaveToGoogleDrive}
							icon={
								<CustomIcon src={GoogleDriveIcon} alt="Google Drive Icon" />
							}
						/>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
