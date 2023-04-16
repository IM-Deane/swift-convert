import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import axios from "axios";
import type { WaitListBodyContents } from "types/api";
import { FeatureDiscoveryItem } from "@/types/site-config";
import LoadingButton from "../LoadingButton";

interface Props {
	isOpen: boolean;
	feature: FeatureDiscoveryItem;
	handleCloseModal: () => void;
	handleResult: (result: boolean) => void;
}

export default function WaitListModal({
	isOpen,
	feature,
	handleCloseModal,
	handleResult,
}: Props) {
	const [userData, setUserData] = useState<WaitListBodyContents>({
		featureId: feature.id,
		name: "",
		email: "",
		isEarlyAdopter: false,
	});
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleFormChange = (event) => {
		const name = event.target.name;
		// if (event.target.value.length > 0 && errorMessage) {
		// 	setErrorMessage("");
		// }
		if (name === "isEarlyAdopter") {
			setUserData({ ...userData, [name]: event.target.checked });
		} else {
			setUserData({ ...userData, [name]: event.target.value });
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		try {
			await axios.post("/api/waitlist", userData);
			handleResult(true);
			handleCloseModal();
		} catch (error) {
			setErrorMessage(error.message);
			handleResult(false);
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
								<div className="w-full justify-items-center">
									<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
										<Dialog.Title
											as="h3"
											className="py-4 text-xl text-center font-bold text-gray-900"
										>
											Get notified when we’re launching:
										</Dialog.Title>

										<div className="px-4 sm:p-6">
											<p className="mx-auto max-w-xl md:px-8 italic text-center sm:text-sm leading-8 text-gray-500">
												{feature.description ||
													"Send an email containing your converted photos"}
											</p>

											<div className="w-full mt-5 ">
												<form onSubmit={handleSubmit} className="space-y-6">
													<div>
														<label
															htmlFor="name"
															className="block text-sm font-medium leading-6 text-gray-900"
														>
															Your name
														</label>
														<div className="mt-2">
															<input
																id="name"
																name="name"
																type="text"
																onChange={handleFormChange}
																required
																className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
															/>
														</div>
													</div>

													<div>
														<label
															htmlFor="email"
															className="block text-sm font-medium leading-6 text-gray-900"
														>
															Email address
														</label>
														<div className="mt-2">
															<input
																id="email"
																name="email"
																type="email"
																autoComplete="email"
																onChange={handleFormChange}
																required
																className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
															/>
														</div>
													</div>

													<div className="flex items-center justify-between">
														<div className="flex items-center">
															<input
																name="isEarlyAdopter"
																onChange={handleFormChange}
																type="checkbox"
																className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
															/>
															<label
																htmlFor="isEarlyAdopter"
																className="ml-2 block text-base text-gray-900"
															>
																Be an early adopter
															</label>
														</div>
													</div>

													<div>
														<LoadingButton
															type="submit"
															isLoading={isLoading}
															text="Join waitlist"
															loadingText="Loading..."
															handleClick={handleSubmit}
															classes="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
														/>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
