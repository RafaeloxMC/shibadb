import { connectDB } from "@/database/database";
import Save from "@/database/schemas/Save";

type Props = {
	gameId: string;
	gameName: string;
};

export default async function Database({ gameId, gameName }: Props) {
	await connectDB();

	const saves = await Save.find({ gameId }).lean();

	const schemaProperties = new Map<
		string,
		{ types: Set<string>; exampleValue: unknown }
	>();

	saves.forEach((save) => {
		if (save.saveData && typeof save.saveData === "object") {
			Object.entries(save.saveData).forEach(([key, value]) => {
				if (!schemaProperties.has(key)) {
					schemaProperties.set(key, {
						types: new Set(),
						exampleValue: value,
					});
				}

				const prop = schemaProperties.get(key)!;
				const valueType = Array.isArray(value)
					? "array"
					: value === null
					? "null"
					: typeof value;
				prop.types.add(valueType);
			});
		}
	});

	const schemaArray = Array.from(schemaProperties.entries()).map(
		([key, { types, exampleValue }]) => ({
			property: key,
			types: Array.from(types).join(" | "),
			exampleValue:
				typeof exampleValue === "object"
					? JSON.stringify(exampleValue)
					: String(exampleValue),
		})
	);

	const totalEntries = saves.length;
	const uniquePlayers = new Set(saves.map((save) => save.playerSlackId)).size;

	const mostRecentSave = saves.sort(
		(a, b) =>
			new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
	)[0];

	return (
		<div className="min-h-screen max-w-6xl mx-auto px-6 py-8">
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
					Database: {gameName}
				</h1>
				<p className="text-neutral-600 dark:text-neutral-400">
					View schema and statistics for your game&apos;s save data
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6">
					<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
						Total Entries
					</div>
					<div className="text-3xl font-bold text-neutral-900 dark:text-white">
						{totalEntries}
					</div>
					<div className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
						Save game records
					</div>
				</div>

				<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6">
					<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
						Unique Players
					</div>
					<div className="text-3xl font-bold text-neutral-900 dark:text-white">
						{uniquePlayers}
					</div>
					<div className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
						Players with saves
					</div>
				</div>

				<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6">
					<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
						Schema Properties
					</div>
					<div className="text-3xl font-bold text-neutral-900 dark:text-white">
						{schemaArray.length}
					</div>
					<div className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
						Unique data fields
					</div>
				</div>
			</div>

			<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 overflow-hidden mb-8">
				<div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
					<h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
						Save Data Schema
					</h2>
					<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
						Properties found in your game&apos;s save data
					</p>
				</div>

				{schemaArray.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="bg-neutral-50 dark:bg-neutral-900/50">
									<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
										Property
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
										Type
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
										Example Value
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
								{schemaArray.map((item, index) => (
									<tr
										key={index}
										className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors"
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<code className="text-sm font-mono text-pink-600 dark:text-pink-400">
												{item.property}
											</code>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
												{item.types}
											</span>
										</td>
										<td className="px-6 py-4">
											<code className="text-sm text-neutral-600 dark:text-neutral-400 break-all">
												{item.exampleValue.length > 100
													? item.exampleValue.substring(
															0,
															100
													  ) + "..."
													: item.exampleValue}
											</code>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="p-12 text-center">
						<div className="text-neutral-400 dark:text-neutral-500 mb-2">
							<svg
								className="w-16 h-16 mx-auto mb-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
								/>
							</svg>
						</div>
						<p className="text-neutral-600 dark:text-neutral-400 font-medium">
							No save data found
						</p>
						<p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
							Create some save data to see the schema here
						</p>
					</div>
				)}
			</div>

			{mostRecentSave && (
				<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6">
					<h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
						Most Recent Save
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
								Save Name
							</label>
							<p className="text-neutral-900 dark:text-white">
								{mostRecentSave.saveName || "Untitled Save"}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
								Player ID
							</label>
							<p className="text-neutral-900 dark:text-white font-mono text-sm">
								{mostRecentSave.playerSlackId}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
								Last Played
							</label>
							<p className="text-neutral-900 dark:text-white">
								{new Date(
									mostRecentSave.lastPlayed
								).toLocaleString()}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
								Version
							</label>
							<p className="text-neutral-900 dark:text-white">
								{mostRecentSave.version || "N/A"}
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
