import Link from "next/link";
import { IGame } from "@/database/schemas/Game";
import { timeSince } from "@/util/time";
import DeleteGameButton from "./DeleteGameButton";
import { Types } from "mongoose";

type Props = {
	game: IGame;
};

export default function GameInfo({ game }: Props) {
	const createdAt =
		game.createdAt instanceof Date
			? game.createdAt.toLocaleString()
			: new Date(game.createdAt || "").toLocaleString();
	const updatedAt =
		game.updatedAt instanceof Date
			? game.updatedAt.toLocaleString()
			: new Date(game.updatedAt || "").toLocaleString();

	const lastPlayed = timeSince(game.lastPlayedAt as Date | undefined);
	const apiKeyCount = (game.apiKeys && game.apiKeys.length) || 0;

	if (!game) {
		return (
			<div>
				<p>Game not found!</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen max-w-7xl mx-auto px-6 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
					Game Info
				</h1>
				<p className="text-neutral-600 dark:text-neutral-400">
					View and manage your game.
				</p>
			</div>
			<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6">
				<div className="flex items-start justify-between gap-6">
					<div className="flex-1">
						<div className="flex flex-row justify-between">
							<div>
								<h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 truncate">
									{game.name}
								</h1>
								<p className="text-neutral-600 dark:text-neutral-400 mb-4">
									{game.description ||
										"No description provided."}
								</p>

								<div className="flex flex-col gap-2">
									<p>Name: {game.name}</p>
									<p>
										ID:{" "}
										{(
											game._id as Types.ObjectId
										).toString()}
									</p>
									<p>API Keys: {apiKeyCount}</p>
									<p>Total sessions: {game.totalSessions}</p>
									<p>
										Unique sessions:{" "}
										{game.uniquePlays.length}
									</p>
								</div>
							</div>

							<aside className="w-56 shrink-0">
								<div className="bg-neutral-50 dark:bg-neutral-900/30 p-4 rounded-lg border border-neutral-200/50 dark:border-neutral-700/50">
									<div className="text-sm text-neutral-600 dark:text-neutral-400">
										Created
									</div>
									<div className="font-medium text-neutral-900 dark:text-white">
										{createdAt}
									</div>

									<div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
										Updated
									</div>
									<div className="font-medium text-neutral-900 dark:text-white">
										{updatedAt}
									</div>

									<div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
										Average session
									</div>
									<div className="font-medium text-neutral-900 dark:text-white">
										{game.averageSessionTime
											? `${Math.round(
													game.averageSessionTime / 60
											  )} min`
											: "0 min"}
									</div>
									<div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
										Last played at
									</div>
									<div className="font-medium text-neutral-900 dark:text-white">
										{lastPlayed}
									</div>
								</div>
							</aside>
						</div>

						<div className="mt-6 grid grid-cols-3 gap-3">
							<Link
								href={`/dashboard/players/${encodeURIComponent(
									game._id.toString()
								)}`}
								className="text-center px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-white rounded-lg transition-colors"
							>
								Players
							</Link>
							<Link
								href={`/dashboard/data/${encodeURIComponent(
									game._id.toString()
								)}`}
								className="text-center px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-white rounded-lg transition-colors"
							>
								Database
							</Link>
							<DeleteGameButton gameId={game._id.toString()} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
