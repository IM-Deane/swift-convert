function TwitterIcon(props) {
	return (
		<svg fill="currentColor" viewBox="0 0 24 24" {...props}>
			<path d="M24 4.583a9.917 9.917 0 01-2.84.775 4.958 4.958 0 002.17-2.725 9.89 9.89 0 01-3.14 1.2 4.945 4.945 0 00-8.43 4.5 14.06 14.06 0 01-10.2-5.17 4.945 4.945 0 001.53 6.59A4.914 4.914 0 01.975 9.5v.05a4.945 4.945 0 003.95 4.83 4.958 4.958 0 01-2.23.09 4.945 4.945 0 004.61 3.43A9.91 9.91 0 010 19.5a13.99 13.99 0 007.56 2.21c9.12 0 14.1-7.55 14.1-14.1 0-.22 0-.45-.02-.67A10.03 10.03 0 0024 4.583z"></path>
		</svg>
	);
}

const navigation = {
	main: [],
	social: [
		{
			name: "Twitter",
			href: "https://twitter.com/thetristandeane",
			icon: (props) => TwitterIcon(props),
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
					<a
						className="underline"
						href="https://tristandeane.ca"
						referrerPolicy="origin"
					>
						Tristan Deane.
					</a>{" "}
					Made with &#x2615;
				</p>
			</div>
		</footer>
	);
}
