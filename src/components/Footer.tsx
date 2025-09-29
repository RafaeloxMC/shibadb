import Link from "next/link";

const Footer = () => (
	<footer className="border-t border-neutral-200/50 dark:border-neutral-800/50 bg-white/30 dark:bg-neutral-900/30 backdrop-blur-sm">
		<div className="max-w-6xl mx-auto px-4 py-12">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				<div className="col-span-1 md:col-span-2">
					<h3 className="text-2xl font-black text-pink-600 dark:text-pink-400 transition-colors duration-300 group-hover:text-pink-700 dark:group-hover:text-pink-300 mb-4">
						ShibaDB
					</h3>
					<p className="text-neutral-600 dark:text-neutral-400 mb-4 max-w-md">
						The ultimate database service for Hackclub Shiba game
						developers. Store, manage, and access your players game
						data with ease.
					</p>
					<div className="flex space-x-4">
						<Link
							href="https://github.com/RafaeloxMC/shibadb"
							className="text-neutral-400 hover:text-pink-500 transition-colors"
						>
							GitHub
						</Link>
						<Link
							href="https://hackclub.slack.com/archives/C09H3QZNA20"
							className="text-neutral-400 hover:text-pink-500 transition-colors"
						>
							Slack
						</Link>
					</div>
				</div>

				<div>
					<h4 className="font-semibold text-neutral-900 dark:text-white mb-4">
						Product
					</h4>
					<ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
						<li>
							<Link
								href="/docs"
								className="hover:text-pink-500 transition-colors"
							>
								API Docs
							</Link>
						</li>
						<li>
							<Link
								href="/pricing"
								className="hover:text-pink-500 transition-colors"
							>
								Pricing
							</Link>
						</li>
						<li>
							<Link
								href="https://downforeveryoneorjustme.com/shibadb.xvcf.dev"
								className="hover:text-pink-500 transition-colors"
							>
								Status
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<h4 className="font-semibold text-neutral-900 dark:text-white mb-4">
						Resources
					</h4>
					<ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
						<li>
							<Link
								href="#"
								className="hover:text-pink-500 transition-colors"
							>
								Getting Started
							</Link>
						</li>
						<li>
							<Link
								href="#"
								className="hover:text-pink-500 transition-colors"
							>
								Examples
							</Link>
						</li>
						<li>
							<Link
								href="https://hackclub.com"
								className="hover:text-pink-500 transition-colors"
							>
								Hack Club
							</Link>
						</li>
					</ul>
				</div>
			</div>

			<div className="border-t border-neutral-200/50 dark:border-neutral-800/50 mt-12 pt-8 text-center">
				<p className="text-neutral-500 dark:text-neutral-400">
					© 2025 ShibaDB. Built with ❤️ for the Hackclub Shiba
					community.
				</p>
			</div>
		</div>
	</footer>
);

export default Footer;
