/** @jsxRuntime classic */
/** @jsx h */
import { useState, useRef, useEffect } from "preact/compat";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { classNames } from "../utils";
import { Input } from "../types";
import { h } from "preact";

interface SelectInputProps {
	inputLabel?: string;
	inputList: Input[];
	selectedInput: Input;
	isDisabled?: boolean;
	handleSelectedInput: (input: Input) => void;
}

export default function ConvertToDropdown({
	inputLabel = "Convert all to",
	inputList,
	selectedInput,
	isDisabled = false,
	handleSelectedInput,
}: SelectInputProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div ref={dropdownRef} className="relative inline-block text-left">
			<div className="flex items-center space-x-2">
				<span className="flex-none text-sm">{inputLabel}</span>{" "}
				<button
					className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
					onClick={() => setIsOpen(!isOpen)}
					disabled={isDisabled}
				>
					{selectedInput ? selectedInput.name : inputLabel}

					{/* <ChevronDownIcon
						className="-mr-1 h-5 w-5 text-gray-400"
						aria-hidden="true"
					/> */}
				</button>
			</div>

			{isOpen && (
				<div className="absolute right-0 z-50 mt-2 w-56 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						{inputList.map((input) => (
							<button
								key={input.id}
								disabled={input.unavailable}
								className={classNames(
									input.unavailable
										? "cursor-not-allowed text-gray-400"
										: "cursor-pointer hover:bg-blue-800",
									"block w-full px-4 py-2 text-sm text-center"
								)}
								onClick={() => {
									handleSelectedInput(input);
									setIsOpen(false);
								}}
							>
								{input.name}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
