import { Gamepad2, Users, Key, Activity } from "lucide-react";
import { IUser } from "@/database/schemas/User";
import { getDashboardData } from "@/util/dashboard";
import Link from "next/link";

interface HomeProps {
	user: IUser;
}

export default async function Home({ user }: HomeProps) {
	const dashboardData = await getDashboardData(user.slackId);

	return (
		<>
			<div className="min-h-screen">
				<div className="max-w-7xl mx-auto px-6 py-8">
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
							Welcome back, {user.name?.split(" ")[0] || "User"}!
							👋
						</h1>
						<p className="text-neutral-600 dark:text-neutral-400">
							Manage your ShibaDB instances and monitor your data.
						</p>
					</div>

					<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6 mb-8">
						<h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
							Account Information
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
									Name
								</label>
								<p className="text-neutral-900 dark:text-white">
									{user.name || "Not provided"}
								</p>
							</div>
							<div>
								<label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
									Created At
								</label>
								<p className="text-neutral-900 dark:text-white">
									{user.createdAt.toLocaleString() ||
										"Not provided"}
								</p>
							</div>
							<div>
								<label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
									Slack ID
								</label>
								<p className="text-neutral-900 dark:text-white font-mono text-sm">
									{user.slackId}
								</p>
							</div>
							<div>
								<label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
									Team ID
								</label>
								<p className="text-neutral-900 dark:text-white font-mono text-sm">
									{user.teamId || "Not provided"}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center space-x-3">
								<div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
									<Gamepad2 className="w-6 h-6 text-pink-600 dark:text-pink-400" />
								</div>
								<div>
									<h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
										My Games
									</h2>
									<p className="text-sm text-neutral-500 dark:text-neutral-400">
										{dashboardData.totalGames}{" "}
										{dashboardData.totalGames === 1
											? "game"
											: "games"}{" "}
										found
									</p>
								</div>
							</div>
							<Link href="/dashboard/games">
								<button className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors duration-300">
									View All Games
								</button>
							</Link>
						</div>

						{dashboardData.totalGames === 0 ? (
							<div className="text-center py-12">
								<Gamepad2 className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
									No games yet
								</h3>
								<p className="text-neutral-600 dark:text-neutral-400 mb-4">
									Create your first game to get started
								</p>
								<Link href="/dashboard/games">
									<button className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors duration-300">
										Create Game
									</button>
								</Link>
							</div>
						) : (
							<div className="space-y-3">
								{dashboardData.games.map((game) => (
									<div
										key={game.id}
										className="bg-neutral-50 dark:bg-neutral-900/50 rounded-lg p-5 border border-neutral-200/50 dark:border-neutral-700/50 hover:shadow-md transition-all duration-300"
									>
										<div className="flex items-center justify-between mb-4">
											<div>
												<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
													{game.name}
												</h3>
												<p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
													Created{" "}
													{game.createdAt
														? new Date(
																game.createdAt
														  ).toLocaleDateString()
														: "N/A"}
												</p>
											</div>
											<Link
												href={`/dashboard/games/${game.id}`}
											>
												<button className="px-4 py-2 text-sm bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white font-medium rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors duration-300">
													View Details
												</button>
											</Link>
										</div>

										<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
											<div className="flex items-center space-x-2">
												<div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
													<Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
												</div>
												<div>
													<p className="text-xs text-neutral-500 dark:text-neutral-400">
														Total Players
													</p>
													<p className="text-sm font-semibold text-neutral-900 dark:text-white">
														{game.totalPlayers}
													</p>
												</div>
											</div>

											<div className="flex items-center space-x-2">
												<div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
													<Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
												</div>
												<div>
													<p className="text-xs text-neutral-500 dark:text-neutral-400">
														Active Today
													</p>
													<p className="text-sm font-semibold text-neutral-900 dark:text-white">
														{game.activePlayers}
													</p>
												</div>
											</div>

											<div className="flex items-center space-x-2">
												<div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
													<Gamepad2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
												</div>
												<div>
													<p className="text-xs text-neutral-500 dark:text-neutral-400">
														Sessions
													</p>
													<p className="text-sm font-semibold text-neutral-900 dark:text-white">
														{game.totalSessions}
													</p>
												</div>
											</div>

											<div className="flex items-center space-x-2">
												<div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
													<Key className="w-4 h-4 text-amber-600 dark:text-amber-400" />
												</div>
												<div>
													<p className="text-xs text-neutral-500 dark:text-neutral-400">
														API Keys
													</p>
													<p className="text-sm font-semibold text-neutral-900 dark:text-white">
														{game.apiKeys}
													</p>
												</div>
											</div>
										</div>

										{game.lastPlayedAt && (
											<div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
												<p className="text-xs text-neutral-500 dark:text-neutral-400">
													Last played:{" "}
													{new Date(
														game.lastPlayedAt
													).toLocaleString()}
												</p>
											</div>
										)}
									</div>
								))}

								{/* Summary Card */}
								<div className="bg-pink-500/20 rounded-lg p-5 border border-pink-200/50 dark:border-pink-700/50 mt-4">
									<h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
										Total Statistics
									</h3>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
										<div>
											<p className="text-xs text-neutral-600 dark:text-neutral-400">
												Total Players
											</p>
											<p className="text-xl font-bold text-neutral-900 dark:text-white">
												{dashboardData.totalPlayers}
											</p>
										</div>
										<div>
											<p className="text-xs text-neutral-600 dark:text-neutral-400">
												Active Today
											</p>
											<p className="text-xl font-bold text-neutral-900 dark:text-white">
												{dashboardData.activePlayers}
											</p>
										</div>
										<div>
											<p className="text-xs text-neutral-600 dark:text-neutral-400">
												Total API Keys
											</p>
											<p className="text-xl font-bold text-neutral-900 dark:text-white">
												{dashboardData.keyAmount}
											</p>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
