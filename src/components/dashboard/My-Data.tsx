import { connectDB } from "@/database/database";
import { ISave } from "@/database/schemas/Save";
import { Types } from "mongoose";
import React from "react";
import DeleteSaveButton from "./DeleteSaveButton";

interface MyDataProps {
	saves: ISave[] | undefined;
}

async function MyData({ saves }: MyDataProps) {
	await connectDB();

	const schemaProperties = new Map<
		string,
		{ types: Set<string>; exampleValue: unknown }
	>();

	if (saves == undefined) {
		saves = [];
	}

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
	const uniquePlayers = Array.from(
		new Set((saves ?? []).map((save) => save.gameId))
	).length;

	const mostRecentSave = saves.sort(
		(a, b) =>
			new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
	)[0];

	return (
		<div className="min-h-screen max-w-7xl mx-auto px-6 py-8">
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
					My Data
				</h1>
				<p className="text-neutral-600 dark:text-neutral-400">
					View statistics for your save games
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
						Unique Games
					</div>
					<div className="text-3xl font-bold text-neutral-900 dark:text-white">
						{uniquePlayers}
					</div>
					<div className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
						Amount of games you have a save in
					</div>
				</div>

				<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6">
					<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
						Stats Tracked
					</div>
					<div className="text-3xl font-bold text-neutral-900 dark:text-white">
						{schemaArray.length}
					</div>
					<div className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
						Unique data fields
					</div>
				</div>
			</div>

			{mostRecentSave && (
				<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6 mb-8">
					<h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
						Most Recent Save
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
								Game ID
							</label>
							<p className="text-neutral-900 dark:text-white font-mono text-sm">
								{mostRecentSave.gameId}
							</p>
						</div>
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

			<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6">
				<h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
					All Saves
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{saves.length === 0 ? (
						<div>
							<p>
								No save data found! Play a game to insert data!
							</p>
						</div>
					) : (
						<div>
							{saves.map((save, idx) => {
								return (
									<div
										key={
											(
												save._id as Types.ObjectId
											).toString() ?? ""
										}
										className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6"
									>
										<div className="mb-2 flex flex-row justify-between">
											<div className="flex items-center">
												<h1 className="font-bold text-xl">
													Save {idx + 1}/
													{saves.length}
												</h1>
											</div>
											<DeleteSaveButton
												gameId={save.gameId}
												saveName={save.saveName}
											/>
										</div>
										<div className="mb-2">
											<strong>Game ID:&nbsp;</strong>
											<span className="font-mono">
												{save.gameId}
											</span>
										</div>
										<div className="mb-2">
											<strong>Save Name:</strong>{" "}
											{save.saveName || "Untitled Save"}
										</div>
										<div className="mb-2">
											<strong>Last Played:</strong>{" "}
											{new Date(
												save.lastPlayed
											).toLocaleString()}
										</div>
										<div className="mb-2">
											<strong>Version:</strong>{" "}
											{save.version || "N/A"}
										</div>
										<div className="mb-2">
											<strong>Save Data:</strong>{" "}
											<pre className="bg-neutral-100 dark:bg-neutral-900 rounded p-2 overflow-x-auto text-xs">
												{JSON.stringify(
													save.saveData,
													null,
													2
												)}
											</pre>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default MyData;
