import Link from "next/link";

const Navbar = () => {
	return (
		<nav className="relative z-20 w-full px-6 py-4">
			<div className="max-w-6xl mx-auto flex items-center justify-between">
				<Link href="/" className="flex items-center space-x-2 group">
					<div className="text-2xl font-black text-pink-600 dark:text-pink-400 transition-colors duration-300 group-hover:text-pink-700 dark:group-hover:text-pink-300">
						ShibaDB
					</div>
				</Link>

				<div className="hidden md:flex items-center space-x-6">
					<Link
						href="/docs"
						className="text-neutral-700 dark:text-neutral-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-colors duration-300"
					>
						Docs
					</Link>
					<Link
						href="/pricing"
						className="text-neutral-700 dark:text-neutral-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-colors duration-300"
					>
						Pricing
					</Link>
					<Link
						href="/api/v1"
						className="text-neutral-700 dark:text-neutral-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-colors duration-300"
					>
						API
					</Link>
				</div>

				<div className="flex items-center space-x-4">
					<Link
						href="/dashboard"
						className="px-6 py-2 bg-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-pink-600 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300/50"
					>
						Dashboard
					</Link>

					<button className="md:hidden p-2 text-neutral-700 dark:text-neutral-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-300">
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>
			</div>

			<div className="md:hidden mt-4 pb-4 border-t border-neutral-200 dark:border-neutral-700">
				<div className="flex flex-col space-y-2 pt-4">
					<Link
						href="/docs"
						className="text-neutral-700 dark:text-neutral-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium py-2 transition-colors duration-300"
					>
						Docs
					</Link>
					<Link
						href="/pricing"
						className="text-neutral-700 dark:text-neutral-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium py-2 transition-colors duration-300"
					>
						Pricing
					</Link>
					<Link
						href="/api"
						className="text-neutral-700 dark:text-neutral-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium py-2 transition-colors duration-300"
					>
						API
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
