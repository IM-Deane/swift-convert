import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
	ChevronDownIcon,
	PaperClipIcon,
	FolderOpenIcon,
} from "@heroicons/react/20/solid";
import { classNames } from "@/utils/index";

export interface UploadOption {
	id: number;
	name: string;
	icon: any;
	action: () => void;
}

export const uploadOptions: UploadOption[] = [
	{
		id: 1,
		name: "From Local System",
		icon: FolderOpenIcon,
		action: () => console.log("Clicked!"),
	},
	{
		id: 2,
		name: "From Public URL",
		icon: PaperClipIcon,
		action: () => console.log("Clicked!"),
	},
	// {
	// 	id: 3,
	// 	name: "Devon Webb",
	// 	icon: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
	// 	action: () => console.log("Clicked!"),
	// },
];

interface SelectUploadMethodProps {
	selectedOption: UploadOption;
	isUploadingMultiple?: boolean;
	handleSelectedMethod: (option: UploadOption) => void;
}

export default function SelectUploadMethod({
	selectedOption,
	isUploadingMultiple = false,
	handleSelectedMethod,
}: SelectUploadMethodProps) {
	return (
		<div className="inline-flex rounded-md shadow-sm">
			<button
				type="button"
				className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
			>
				{isUploadingMultiple ? "Add more Files" : "Select File to upload"}
			</button>
			<Menu as="div" className="relative -ml-px block">
				<Menu.Button className="relative inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
					<span className="sr-only">Open options</span>
					<ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
				</Menu.Button>
				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute right-0 z-10 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
						<div className="py-1">
							{uploadOptions.map((item) => (
								<Menu.Item key={item.name}>
									{({ active }) => (
										<button
											onClick={item.action}
											className={classNames(
												active ? "bg-gray-100 text-gray-900" : "text-gray-700",
												"block px-4 py-2 text-sm w-full flex justify-center"
											)}
										>
											<item.icon
												className="h-5 w-5 text-gray-800"
												aria-hidden="true"
											/>

											<span className="grow text-left ml-3">{item.name}</span>
										</button>
									)}
								</Menu.Item>
							))}
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
}
