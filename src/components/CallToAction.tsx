const CallToAction = () => (
	<section className="text-center py-16">
		<div className="max-w-3xl mx-auto">
			<h3 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
				Ready to get started?
			</h3>
			<p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10">
				It&apos;s never too late! Join other developers already using
				ShibaDB for their games
			</p>

			<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
				<a
					href="/dashboard"
					className="px-10 py-4 bg-pink-500 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl hover:bg-pink-600 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300/50"
				>
					Get Your Token
				</a>

				<a
					href="#"
					className="px-8 py-4 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700 hover:border-pink-300 dark:hover:border-pink-500"
				>
					View Documentation
				</a>
			</div>
		</div>
	</section>
);

export default CallToAction;
