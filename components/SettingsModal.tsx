import { useState, useRef, useEffect, Fragment, SyntheticEvent } from "react";

import { Dialog, Transition } from "@headlessui/react";

import SelectInput from "./SelectInput";
import { useSettingsContext } from "@/context/SettingsProvider";
import { Input, fileTypes, settingsInputTypes } from "@/types/index";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

export default function SettingsModal({ isOpen, setIsOpen }) {
	const { settings, updateSettings } = useSettingsContext();

	const [isReady, setIsReady] = useState(false);
	const [selectedInputType, setSelectedInputType] = useState<Input>(null);
	const [selectedOutputType, setSelectedOutputType] = useState<Input>(null);
	const [selectedImageQuality, setSelectedImageQuality] = useState<number>(90);

	const cancelButtonRef = useRef(null);

	const handleImageQualityChange = (event: SyntheticEvent) => {
		const target = event.target as HTMLInputElement;
		setSelectedImageQuality(Number(target.value));
	};

	const handleSave = () => {
		updateSettings({
			fileInputId: selectedInputType.id as string,
			fileOutputId: selectedOutputType.id as string,
			imageQuality: selectedImageQuality,
		});
		setIsOpen(false);
	};

	useEffect(() => {
		if (settings) {
			setSelectedInputType(
				settingsInputTypes.find((input) => input.id === settings?.fileInputId)
			);
			setSelectedOutputType(
				fileTypes.find((input) => input.id === settings?.fileOutputId)
			);
			setSelectedImageQuality(Number(settings?.imageQuality));
			setIsReady(true);
		}
	}, [settings]);

	return (
		<Transition.Root show={isOpen} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10 w-64"
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
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
								<div>
									<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
										<AdjustmentsHorizontalIcon
											className="h-6 w-6 text-blue-600"
											aria-hidden="true"
										/>
									</div>
									<div className="mt-3 text-center sm:mt-5">
										<Dialog.Title
											as="h3"
											className="text-base font-semibold leading-6 text-gray-900"
										>
											Photo Settings
										</Dialog.Title>
										<div className="mt-2 px-8">
											<p className="text-sm text-gray-500">
												Customize your image settings
											</p>
											{isReady && (
												<div className="flex flex-wrap mt-8">
													<div className="flex-auto w-50 mr-1">
														<SelectInput
															inputLabel="Input"
															inputList={settingsInputTypes}
															selectedInput={selectedInputType}
															isDisabled
															handleSelectedInput={setSelectedInputType}
														/>
													</div>
													<div className="flex-auto w-50 ml-1">
														<SelectInput
															inputLabel="Output"
															inputList={fileTypes}
															selectedInput={selectedOutputType}
															handleSelectedInput={setSelectedOutputType}
														/>
													</div>
													<div className="mt-8 mb-4 grow w-full">
														<label
															htmlFor="image-quality"
															className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
														>
															Set image quality
														</label>
														<input
															id="image-quality"
															type="range"
															min="25"
															max="100"
															step="25"
															value={selectedImageQuality}
															onChange={handleImageQualityChange}
															className="w-full h-2 accent-pink-500 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
														/>
														<ul className="flex justify-between w-full px-[10px]">
															<li className="flex justify-center relative">
																<span
																	className={`absolute ${
																		selectedImageQuality >= 25 &&
																		selectedImageQuality < 50 &&
																		"text-xl"
																	}`}
																>
																	🥴
																</span>
															</li>
															<li className="flex justify-center relative">
																<span
																	className={`absolute ${
																		selectedImageQuality >= 50 &&
																		selectedImageQuality < 75 &&
																		"text-xl"
																	}`}
																>
																	😵‍💫
																</span>
															</li>
															<li className="flex justify-center relative">
																<span
																	className={`absolute ${
																		selectedImageQuality >= 75 &&
																		selectedImageQuality < 85 &&
																		"text-xl"
																	}`}
																>
																	😄
																</span>
															</li>
															<li className="flex justify-center relative">
																<span
																	className={`absolute ${
																		selectedImageQuality >= 85 && "text-xl"
																	}`}
																>
																	🤩
																</span>
															</li>
														</ul>
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
								<div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
									<button
										type="button"
										className="inline-flex w-full justify-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
										onClick={handleSave}
									>
										Save
									</button>
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
