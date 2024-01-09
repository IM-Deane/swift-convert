import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "../utils";
import { Input } from "../types";

interface SelectInputProps {
	inputLabel?: string;
	inputList: Input[];
	selectedInput: Input;
	isDisabled?: boolean;
	handleSelectedInput: (input: Input) => void;
}

export default function ConvertToDropdown({
	inputLabel = "Convert to",
	inputList,
	selectedInput,
	isDisabled = false,
	handleSelectedInput,
}: SelectInputProps) {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div className="flex items-center space-x-2">
				<span className="flex-none text-sm">{inputLabel}</span>{" "}
				<Menu.Button
					className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-50"
					disabled={isDisabled}
				>
					{selectedInput ? selectedInput.name : inputLabel}
					<ChevronDownIcon
						className="-mr-1 h-5 w-5 text-gray-400"
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
				<Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						{inputList.map((input) => (
							<Menu.Item key={input.id} disabled={input.unavailable}>
								<button
									disabled={input.unavailable}
									className={classNames(
										input.unavailable
											? "cursor-not-allowed text-gray-200 bg-gray-50"
											: "cursor-pointer hover:bg-blue-300 hover:text-white",
										selectedInput.name === input.name
											? "bg-blue-500 text-white"
											: "text-gray-700",
										"block w-full px-4 py-2 text-sm text-center"
									)}
									onClick={() => handleSelectedInput(input)}
								>
									{input.name}
								</button>
							</Menu.Item>
						))}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
