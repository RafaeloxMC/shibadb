const features = [
	{
		title: "🚀 Easy Integration",
		desc: "Simple REST API for storing and retrieving save games and leaderboard entries with just a few lines of code.",
	},
	{
		title: "🔐 Secure Tokens",
		desc: "Each game gets a unique token for secure data access. Your data stays private and protected.",
	},
	{
		title: "⚡ Lightning Fast",
		desc: "Optimized for speed and reliability with efficient database queries, and scalable infrastructure.",
	},
	{
		title: "📊 Real-time Analytics",
		desc: "Track player engagement and game statistics with built-in analytics dashboard.",
	},
];

const Features = () => (
	<section className="max-w-6xl mx-auto py-16">
		<div className="text-center mb-16">
			<h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
				Why Choose ShibaDB?
			</h2>
			<p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
				Everything you need to manage game data, built specifically for
				developers
			</p>
		</div>

		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
			{features.map((f, i) => (
				<div
					key={i}
					className="group relative rounded-3xl bg-white/70 dark:bg-neutral-800/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-white/20 dark:border-neutral-700/30 hover:-translate-y-1"
				>
					<h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
						{f.title}
					</h3>
					<p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
						{f.desc}
					</p>
				</div>
			))}
		</div>
	</section>
);

export default Features;
