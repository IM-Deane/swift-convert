import { Fragment, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import siteConfig from "site.config";

import { classNames } from "@/utils/index";

import Footer from "./Footer";

const navigation = siteConfig.mainNavTabs;

export default function Layout({ title = siteConfig.slogan, children }) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const router = useRouter();

	navigation.forEach((item) => {
		if (item.href === router.pathname) {
			item.current = true;
		} else {
			item.current = false;
		}
	});

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<div className="flex h-full">
				{/* Narrow sidebar */}
				<div className="hidden w-28 overflow-y-auto bg-gray-900 md:block">
					<div className="flex w-full flex-col items-center py-6">
						<div className="flex flex-shrink-0 items-center">
							<div className="relative h-16 w-16">
								<Image
									src={siteConfig.productBrand}
									alt={`${siteConfig.siteName} logo`}
									fill
								/>
							</div>
						</div>
						<div className="mt-6 w-full flex-1 space-y-1 px-2">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={classNames(
										item.current
											? "bg-gray-800 text-white"
											: "text-blue-100 hover:bg-blue-800 hover:text-white",
										"group flex w-full flex-col items-center rounded-md p-3 text-xs font-medium"
									)}
									aria-current={item.current ? "page" : undefined}
								>
									<item.icon
										className={classNames(
											item.current
												? "text-white"
												: "text-blue-300 group-hover:text-white",
											"h-6 w-6"
										)}
										aria-hidden="true"
									/>
									<span className="mt-2">{item.name}</span>
								</Link>
							))}
						</div>
					</div>
				</div>
				{/* Mobile menu */}
				<Transition.Root show={mobileMenuOpen} as={Fragment}>
					<Dialog
						as="div"
						className="relative z-40 md:hidden"
						onClose={setMobileMenuOpen}
					>
						<Transition.Child
							as={Fragment}
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
						</Transition.Child>
						<div className="fixed inset-0 z-40 flex">
							<Transition.Child
								as={Fragment}
								enter="transition ease-in-out duration-300 transform"
								enterFrom="-translate-x-full"
								enterTo="translate-x-0"
								leave="transition ease-in-out duration-300 transform"
								leaveFrom="translate-x-0"
								leaveTo="-translate-x-full"
							>
								<Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800 pb-4 pt-5">
									<Transition.Child
										as={Fragment}
										enter="ease-in-out duration-300"
										enterFrom="opacity-0"
										enterTo="opacity-100"
										leave="ease-in-out duration-300"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
									>
										<div className="absolute right-0 top-1 -mr-14 p-1">
											<button
												type="button"
												className="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white"
												onClick={() => setMobileMenuOpen(false)}
											>
												<XMarkIcon
													className="h-6 w-6 text-white"
													aria-hidden="true"
												/>
												<span className="sr-only">Close sidebar</span>
											</button>
										</div>
									</Transition.Child>
									<div className="flex flex-shrink-0 items-center px-4">
										<div className="relative h-16 w-16">
											<Image
												src={siteConfig.productBrand}
												alt={`${siteConfig.siteName} logo`}
												fill
											/>
										</div>
									</div>
									<div className="mt-5 h-0 flex-1 overflow-y-auto px-2">
										<nav className="flex h-full flex-col">
											<div className="space-y-1">
												{navigation.map((item) => (
													<Link
														key={item.name}
														href={item.href}
														className={classNames(
															item.current
																? "bg-gray-800 text-white"
																: "text-blue-100 hover:bg-gray-800 hover:text-white",
															"group flex items-center rounded-md py-2 px-3 text-sm font-medium"
														)}
														aria-current={item.current ? "page" : undefined}
													>
														<item.icon
															className={classNames(
																item.current
																	? "text-white"
																	: "text-blue-300 group-hover:text-white",
																"mr-3 h-6 w-6"
															)}
															aria-hidden="true"
														/>
														<span>{item.name}</span>
													</Link>
												))}
											</div>
										</nav>
									</div>
								</Dialog.Panel>
							</Transition.Child>
							<div className="w-14 flex-shrink-0" aria-hidden="true">
								{/* Dummy element to force sidebar to shrink to fit close icon */}
							</div>
						</div>
					</Dialog>
				</Transition.Root>
				{/* Content area */}
				<div className="flex flex-1 flex-col overflow-y-auto">
					<header className="w-full"></header>
					{children}
					<Footer />
				</div>
			</div>
		</>
	);
}
