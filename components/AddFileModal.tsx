import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PaperClipIcon, XMarkIcon } from "@heroicons/react/24/outline";

import axios from "axios";

import LoadingButton from "./LoadingButton";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

export default function AddFileModal({ isOpen, handleCloseModal, handleSave }) {
	const [inputURL, setInputURL] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleInputChange = (event) => {
		setInputURL(event.target.value);
	};

	const handleSubmit = async () => {
		if (!inputURL || !inputURL.length) {
			setErrorMessage("The link you entered is invalid");
			return;
		}
		setIsLoading(true);

		try {
			const response = await axios.get(inputURL);
			console.log(response);
			handleSave(response.data);
			handleCloseModal();
		} catch (error) {
			setErrorMessage(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Transition.Root show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
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
										onClick={handleCloseModal}
									>
										<span className="sr-only">Close</span>
										<XMarkIcon className="h-6 w-6" aria-hidden="true" />
									</button>
								</div>
								<div className="sm:flex sm:items-start">
									<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 sm:mx-0 sm:h-10 sm:w-10">
										<PaperClipIcon
											className="h-6 w-6 text-blue-600"
											aria-hidden="true"
										/>
									</div>
									<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
										<Dialog.Title
											as="h3"
											className="text-base font-semibold leading-6 text-gray-900"
										>
											Upload file by URL
										</Dialog.Title>

										<div className="px-4 sm:p-6">
											<div className="max-w-xl text-sm text-gray-500">
												<p>
													Add a new file using a{" "}
													<span className="font-semibold">public url</span> that
													allows downloads.
												</p>
											</div>
											<div className="mt-5 sm:flex sm:items-center">
												<div className="w-full sm:max-w-xs">
													<label htmlFor="file" className="sr-only">
														File
													</label>
													<input
														type="text"
														name="file"
														id="file"
														onChange={handleInputChange}
														className="block w-full rounded-md border-0 py-1.5 px-3 text-xl text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
														placeholder="https://cdn.example.com"
													/>
													{errorMessage && (
														<div>
															<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
																<ExclamationCircleIcon
																	className="h-5 w-5 text-red-500"
																	aria-hidden="true"
																/>
															</div>
															<p
																className="mt-2 text-sm text-red-600"
																id="file-error"
															>
																{errorMessage}
															</p>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
									<LoadingButton
										isLoading={isLoading}
										text="Add file"
										loadingText="Loading..."
										handleClick={handleSubmit}
									/>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
