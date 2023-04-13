import Image from "next/image";

import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import DropboxChooser from "react-dropbox-chooser";

import DropboxLogo from "../public/logos/dropbox.svg";
import { useSettingsContext } from "@/context/SettingsProvider";

export default function DropboxChooseModal({ isOpen, setIsOpen, onSuccess }) {
	const cancelButtonRef = useRef(null);

	const { settings } = useSettingsContext();

	const handleFileSelection = (files) => {
		onSuccess(files);
		setIsOpen(false);
	};

	return (
		<Transition.Root show={isOpen} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				initialFocus={cancelButtonRef}
				onClose={() => setIsOpen(false)}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
								<div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
									<button
										type="button"
										className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										onClick={() => setIsOpen(false)}
									>
										<span className="sr-only">Close</span>
										<XMarkIcon className="h-6 w-6" aria-hidden="true" />
									</button>
								</div>
								<div>
									<div className="relative mx-auto flex h-12 w-12 items-center justify-center  bg-blue-300">
										<Image src={DropboxLogo} fill alt="dropbox" />
									</div>
									<div className="mt-3 text-center sm:mt-5">
										<Dialog.Title
											as="h3"
											className="text-base font-semibold leading-6 text-gray-900"
										>
											Dropbox
										</Dialog.Title>
										<div className="mt-2">
											<p className="text-sm text-gray-500">
												Sign into your Dropbox account to access your files.
											</p>
										</div>
									</div>
								</div>
								<div className="mt-5 md:flex sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
									<div className="w-full">
										<DropboxChooser
											appKey={"0srlta70mx0izr1"}
											success={(files) => handleFileSelection(files)}
											cancel={() => setIsOpen(false)}
											multiselect={true}
											linkType="direct"
											extensions={[settings?.fileInputId]}
										>
											<button
												type="button"
												className="dropbox-button inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
											>
												Choose files
											</button>
										</DropboxChooser>
									</div>

									<button
										type="button"
										className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
										onClick={() => setIsOpen(false)}
										ref={cancelButtonRef}
									>
										Cancel
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
