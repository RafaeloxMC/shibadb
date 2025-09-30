import Link from "next/link";
import { IGame } from "@/database/schemas/Game";
import { timeSince } from "@/util/time";
import DeleteGameButton from "./DeleteGameButton";

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
		<div className="min-h-screen max-w-4xl mx-auto px-6 py-8">
			<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6">
				<div className="flex items-start justify-between gap-6">
					<div className="flex-1">
						<h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 truncate">
							{game.name}
						</h1>
						<p className="text-neutral-600 dark:text-neutral-400 mb-4">
							{game.description || "No description provided."}
						</p>

						<div className="flex flex-wrap gap-3 text-sm">
							<span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full text-neutral-700 dark:text-neutral-200">
								Owner:{" "}
								<span className="font-mono ml-1">
									{game.ownerSlackId}
								</span>
							</span>
							<span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full text-neutral-700 dark:text-neutral-200">
								Players:{" "}
								<span className="font-medium ml-1">
									{game.totalPlayers ?? 0}
								</span>
							</span>
							<span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full text-neutral-700 dark:text-neutral-200">
								Active:{" "}
								<span className="font-medium ml-1">
									{game.activePlayers ?? 0}
								</span>
							</span>
							<span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full text-neutral-700 dark:text-neutral-200">
								API Keys:{" "}
								<span className="font-medium ml-1">
									{apiKeyCount}
								</span>
							</span>
							<span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full text-neutral-700 dark:text-neutral-200">
								Last Played:{" "}
								<span className="font-medium ml-1">
									{lastPlayed}
								</span>
							</span>
						</div>

						<div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
							<Link
								href={`/dashboard/games/${encodeURIComponent(
									game._id.toString()
								)}/players`}
								className="text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
							>
								Players - Soon ™️
							</Link>
							<Link
								href={`/dashboard/keys/${encodeURIComponent(
									game._id.toString()
								)}`}
								className="text-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
							>
								API Keys
							</Link>
							<DeleteGameButton gameId={game._id.toString()} />
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
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}
