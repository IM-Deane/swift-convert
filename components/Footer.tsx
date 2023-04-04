const navigation = {
	main: [
		{ name: "FAQ", href: "#" },
		{ name: "Terms of Use", href: "#" },
	],
	social: [
		{
			name: "GitHub",
			href: "https://github.com/IM-Deane",
			icon: (props) => (
				<svg fill="currentColor" viewBox="0 0 24 24" {...props}>
					<path
						fillRule="evenodd"
						d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
						clipRule="evenodd"
					/>
				</svg>
			),
		},
		{
			name: "LinkedIn",
			href: "https://www.linkedin.com/in/tristan-deane-software-developer",
			icon: (props) => (
				<svg
					fill="currentColor"
					height="20px"
					width="20px"
					version="1.1"
					id="Layer_1"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="-31 -31 372.00 372.00"
				>
					<g id="SVGRepo_bgCarrier" stroke-width="0">
						<rect
							x="-31"
							y="-31"
							width="372.00"
							height="372.00"
							rx="0"
							fill="#dddfdf"
							strokeWidth="0"
						></rect>
					</g>
					<g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
					></g>
					<g id="SVGRepo_iconCarrier">
						{" "}
						<g id="XMLID_801_">
							{" "}
							<path
								id="XMLID_802_"
								d="M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73 C77.16,101.969,74.922,99.73,72.16,99.73z"
							></path>{" "}
							<path
								id="XMLID_803_"
								d="M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4 c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z"
							></path>{" "}
							<path
								id="XMLID_804_"
								d="M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599 c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319 c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995 C310,145.43,300.549,94.761,230.454,94.761z"
							></path>{" "}
						</g>{" "}
					</g>
				</svg>
			),
		},
	],
};

export default function Footer() {
	return (
		<footer className="bg-white">
			<div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
				<nav
					className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
					aria-label="Footer"
				>
					{navigation.main.map((item) => (
						<div key={item.name} className="pb-6">
							<a
								href={item.href}
								className="text-sm leading-6 text-gray-600 hover:text-gray-900"
							>
								{item.name}
							</a>
						</div>
					))}
				</nav>
				<div className="mt-10 flex justify-center space-x-10">
					{navigation.social.map((item) => (
						<a
							key={item.name}
							href={item.href}
							referrerPolicy="no-referrer"
							className="text-gray-400 hover:text-gray-500"
						>
							<span className="sr-only">{item.name}</span>
							<item.icon className="h-6 w-6" aria-hidden="true" />
						</a>
					))}
				</div>
				<p className="mt-10 text-center text-xs leading-5 text-gray-500">
					&copy; {new Date().getFullYear()}{" "}
					<a href="https://tristandeane.ca" referrerPolicy="origin">
						Tristan Deane.
					</a>{" "}
					Made with &hearts;
				</p>
			</div>
		</footer>
	);
}
