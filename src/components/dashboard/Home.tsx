import {
	ChartNoAxesCombined,
	Cog,
	DatabaseZapIcon,
	Gamepad2,
	TerminalSquare,
	Users2,
} from "lucide-react";
import { IUser } from "@/database/schemas/User";
import Image from "next/image";
import Link from "next/link";
import { getDashboardData } from "@/util/dashboard";

interface HomeProps {
	user: IUser;
}

export default async function Home({ user }: HomeProps) {
	const dashboardData = await getDashboardData(user.slackId);

	return (
		<>
			<div className="min-h-screen">
				<nav className="relative z-20 w-full px-6 py-4 border-b border-neutral-200 dark:border-neutral-700/50">
					<div className="max-w-7xl mx-auto flex items-center justify-between">
						<Link
							href="/"
							className="flex items-center space-x-2 group"
						>
							<div className="text-2xl font-black text-pink-600 dark:text-pink-400 transition-colors duration-300 group-hover:text-pink-700 dark:group-hover:text-pink-300">
								ShibaDB
							</div>
							<span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
								Dashboard
							</span>
						</Link>

						<div className="flex items-center space-x-4">
							{user.avatar && (
								<Image
									src={user.avatar}
									alt={user.name || "User"}
									width={32}
									height={32}
									className="w-8 h-8 rounded-full border-2 border-pink-200 dark:border-pink-700"
								/>
							)}
							<span className="text-neutral-700 dark:text-neutral-300 font-medium">
								{user.name || "User"}
							</span>
							{!user && (
								<span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
									Mock Data
								</span>
							)}
							<Link
								href="/api/v1/auth/logout"
								prefetch={false}
								className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-colors duration-300"
							>
								Logout
							</Link>
						</div>
					</div>
				</nav>

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

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
									<Gamepad2 className="w-6 h-6 text-pink-600 dark:text-pink-400" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
										Games
									</h3>
									<p className="text-sm text-neutral-500 dark:text-neutral-400">
										Manage game instances
									</p>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-neutral-600 dark:text-neutral-400">
										Active Games
									</span>
									<span className="font-medium text-neutral-900 dark:text-white">
										{dashboardData.totalGames}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-neutral-600 dark:text-neutral-400">
										Total Players
									</span>
									<span className="font-medium text-neutral-900 dark:text-white">
										{dashboardData.totalPlayers}
									</span>
								</div>
							</div>
							<button className="w-full mt-4 px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors duration-300">
								Manage Games
							</button>
						</div>

						<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
									<Users2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
										Users
									</h3>
									<p className="text-sm text-neutral-500 dark:text-neutral-400">
										User management
									</p>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-neutral-600 dark:text-neutral-400">
										Total Users
									</span>
									<span className="font-medium text-neutral-900 dark:text-white">
										{dashboardData.totalPlayers}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-neutral-600 dark:text-neutral-400">
										Active Today
									</span>
									<span className="font-medium text-neutral-900 dark:text-white">
										{dashboardData.activePlayers}
									</span>
								</div>
							</div>
							<button className="w-full mt-4 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-300">
								Manage Users
							</button>
						</div>

						<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
									<TerminalSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
										API Keys
									</h3>
									<p className="text-sm text-neutral-500 dark:text-neutral-400">
										Manage API access
									</p>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-neutral-600 dark:text-neutral-400">
										Active Keys
									</span>
									<span className="font-medium text-neutral-900 dark:text-white">
										{dashboardData.keyAmount || 0}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-neutral-600 dark:text-neutral-400">
										Requests Today
									</span>
									<span className="font-medium text-neutral-900 dark:text-white">
										1,542
									</span>
								</div>
							</div>
							<button className="w-full mt-4 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-300">
								Manage API Keys
							</button>
						</div>

						<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
									<DatabaseZapIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
										Database
									</h3>
									<p className="text-sm text-neutral-500 dark:text-neutral-400">
										Storage & performance
									</p>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-neutral-600 dark:text-neutral-400">
										Storage Used
									</span>
									<span className="font-medium text-neutral-900 dark:text-white">
										2.4 MB
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-neutral-600 dark:text-neutral-400">
										Collections
									</span>
									<span className="font-medium text-neutral-900 dark:text-white">
										8
									</span>
								</div>
							</div>
							<button className="w-full mt-4 px-4 py-2 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors duration-300">
								View Database
							</button>
						</div>

						<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
									<ChartNoAxesCombined className="w-6 h-6 text-orange-600 dark:text-orange-400" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
										Analytics
									</h3>
									<p className="text-sm text-neutral-500 dark:text-neutral-400">
										Usage insights
									</p>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-neutral-600 dark:text-neutral-400">
										Last Played
									</span>
									<span className="font-medium text-neutral-900 dark:text-white">
										{dashboardData.lastPlayed}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-neutral-600 dark:text-neutral-400">
										Average Time
									</span>
									<span className="font-medium text-neutral-900 dark:text-white">
										{dashboardData.averageSessionTime}
									</span>
								</div>
							</div>
							<button className="w-full mt-4 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors duration-300">
								View Analytics
							</button>
						</div>

						<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-12 h-12 bg-neutral-500/20 rounded-xl flex items-center justify-center">
									<Cog className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
										Settings
									</h3>
									<p className="text-sm text-neutral-500 dark:text-neutral-400">
										Account & preferences
									</p>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-neutral-600 dark:text-neutral-400">
										Theme
									</span>
									<span className="font-medium text-neutral-900 dark:text-white">
										Auto
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-neutral-600 dark:text-neutral-400">
										Notifications
									</span>
									<span className="font-medium text-neutral-900 dark:text-white">
										Enabled
									</span>
								</div>
							</div>
							<button className="w-full mt-4 px-4 py-2 bg-neutral-500 text-white font-medium rounded-lg hover:bg-neutral-600 transition-colors duration-300">
								Manage Settings
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
