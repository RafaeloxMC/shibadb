import React from "react";
import { timeSince } from "@/util/time";
import { Users2, Activity, Clock, Calendar } from "lucide-react";

interface PlayersProps {
	playerData: {
		totalPlayers: number;
		activePlayers: number;
		totalSessions: number;
		averageSessionTime: number;
		lastPlayedAt?: Date;
	};
}

export default function Players({ playerData }: PlayersProps) {
	const lastPlayed = timeSince(playerData.lastPlayedAt);
	const avgSessionMinutes = Math.round(playerData.averageSessionTime / 60);

	return (
		<div className="min-h-screen max-w-7xl mx-auto px-6 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
					Players
				</h1>
				<p className="text-neutral-600 dark:text-neutral-400">
					View and manage player statistics for this game.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6 hover:shadow-xl transition-all duration-300">
					<div className="flex items-center space-x-3 mb-4">
						<div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
							<Users2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
								Total Players
							</h3>
							<p className="text-2xl font-bold text-neutral-900 dark:text-white">
								{playerData.totalPlayers}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6 hover:shadow-xl transition-all duration-300">
					<div className="flex items-center space-x-3 mb-4">
						<div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
							<Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
								Active Players
							</h3>
							<p className="text-2xl font-bold text-neutral-900 dark:text-white">
								{playerData.activePlayers}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6 hover:shadow-xl transition-all duration-300">
					<div className="flex items-center space-x-3 mb-4">
						<div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
							<Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
								Avg Session
							</h3>
							<p className="text-2xl font-bold text-neutral-900 dark:text-white">
								{avgSessionMinutes > 0
									? `${avgSessionMinutes} min`
									: "0 min"}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6 hover:shadow-xl transition-all duration-300">
					<div className="flex items-center space-x-3 mb-4">
						<div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
							<Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
								Last Played
							</h3>
							<p className="text-2xl font-bold text-neutral-900 dark:text-white">
								{lastPlayed}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
							Player Details
						</h3>
						<p className="text-sm text-neutral-500 dark:text-neutral-400">
							Detailed player information and statistics
						</p>
					</div>
				</div>

				<div className="space-y-4">
					<div className="flex justify-between items-center p-4 bg-neutral-50 dark:bg-neutral-900/30 rounded-lg border border-neutral-100 dark:border-neutral-700/30">
						<div>
							<span className="text-sm font-medium text-neutral-700 dark:text-white">
								Total Sessions
							</span>
							<p className="text-xs text-neutral-500 dark:text-neutral-400">
								Number of gameplay sessions
							</p>
						</div>
						<span className="text-lg font-bold text-neutral-900 dark:text-white">
							{playerData.totalSessions}
						</span>
					</div>

					<div className="flex justify-between items-center p-4 bg-neutral-50 dark:bg-neutral-900/30 rounded-lg border border-neutral-100 dark:border-neutral-700/30">
						<div>
							<span className="text-sm font-medium text-neutral-700 dark:text-white">
								Engagement Rate
							</span>
							<p className="text-xs text-neutral-500 dark:text-neutral-400">
								Active players / Total players
							</p>
						</div>
						<span className="text-lg font-bold text-neutral-900 dark:text-white">
							{playerData.totalPlayers > 0
								? `${Math.round(
										(playerData.activePlayers /
											playerData.totalPlayers) *
											100
								  )}%`
								: "N/A"}
						</span>
					</div>
				</div>

				<div className="mt-6 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
					<p className="text-sm text-pink-800 dark:text-pink-200">
						Detailed analytics: <strong>Soon ™️</strong>
					</p>
				</div>
			</div>
		</div>
	);
}
