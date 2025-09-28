import { cookies } from "next/headers";
import { connectDB } from "@/database/database";
import Session from "@/database/schemas/Session";
import User, { IUser } from "@/database/schemas/User";
import Game from "@/database/schemas/Game";
import GradientBackground from "@/components/GradientBackground";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import {
	ChartNoAxesCombined,
	Cog,
	DatabaseZapIcon,
	Gamepad2,
	TerminalSquare,
	Users2,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Types } from "mongoose";

const mockUser: IUser = {
	_id: "mock_user_id",
	name: "John Doe",
	email: "john.doe@example.com",
	slackId: "U1234567890",
	teamId: "T0987654321",
	avatar: "https://ca.slack-edge.com/T0987654321-U1234567890-abc123def456-512",
	createdAt: new Date(),
	updatedAt: new Date(),
} as IUser;

async function getAuthenticatedUser(): Promise<IUser | null> {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("shibaCookie")?.value;

		if (!token) {
			return null;
		}

		await connectDB();

		const session = await Session.findOne({
			token,
			expiresAt: { $gt: new Date() },
		});

		if (!session) {
			return null;
		}

		const user = await User.findById(session.userId);
		return user;
	} catch (error) {
		console.error("Authentication error:", error);
		return null;
	}
}

async function getDashboardData(ownerSlackId: string) {
	try {
		await connectDB();

		const games = await Game.find({ ownerSlackId }).select(
			"totalPlayers activePlayers totalSessions averageSessionTime lastPlayedAt"
		);

		const totalGames = games.length;
		const totalPlayers = games.reduce(
			(sum, game) => sum + (game.totalPlayers || 0),
			0
		);
		const activePlayers = games.reduce(
			(sum, game) => sum + (game.activePlayers || 0),
			0
		);

		const lastPlayedGame = games
			.filter((game) => game.lastPlayedAt)
			.sort(
				(a, b) =>
					new Date(b.lastPlayedAt!).getTime() -
					new Date(a.lastPlayedAt!).getTime()
			)[0];

		const avgSessionTime =
			games.length > 0
				? Math.round(
						games.reduce(
							(sum, game) => sum + (game.averageSessionTime || 0),
							0
						) / games.length
				  )
				: 0;

		const getTimeSinceLastPlayed = () => {
			if (!lastPlayedGame?.lastPlayedAt) return "Never";
			const diff =
				Date.now() - new Date(lastPlayedGame.lastPlayedAt).getTime();
			const minutes = Math.floor(diff / (1000 * 60));
			const hours = Math.floor(minutes / 60);
			const days = Math.floor(hours / 24);

			if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
			if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
			if (minutes > 0)
				return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
			return "Just now";
		};

		return {
			totalGames,
			totalPlayers,
			activePlayers,
			lastPlayed: getTimeSinceLastPlayed(),
			averageSessionTime:
				avgSessionTime > 0
					? `${Math.round(avgSessionTime / 60)} min`
					: "0 min",
		};
	} catch (error) {
		console.error("Error fetching dashboard data:", error);
		return {
			totalGames: 12,
			totalPlayers: 247,
			activePlayers: 89,
			lastPlayed: "2 minutes ago",
			averageSessionTime: "14 min",
		};
	}
}

export default async function Dashboard() {
	const user = await getAuthenticatedUser();
	const displayUser = user || mockUser;

	if (!user) {
		redirect("/auth/login");
	}

	const dashboardData = await getDashboardData(user.slackId);

	return (
		<GradientBackground>
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
							{displayUser.avatar && (
								<Image
									src={displayUser.avatar}
									alt={displayUser.name || "User"}
									width={32}
									height={32}
									className="w-8 h-8 rounded-full border-2 border-pink-200 dark:border-pink-700"
								/>
							)}
							<span className="text-neutral-700 dark:text-neutral-300 font-medium">
								{displayUser.name ||
									displayUser.email ||
									"User"}
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
							Welcome back,{" "}
							{displayUser.name?.split(" ")[0] || "User"}! 👋
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
									{displayUser.name || "Not provided"}
								</p>
							</div>
							<div>
								<label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
									Email
								</label>
								<p className="text-neutral-900 dark:text-white">
									{displayUser.email || "Not provided"}
								</p>
							</div>
							<div>
								<label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
									Slack ID
								</label>
								<p className="text-neutral-900 dark:text-white font-mono text-sm">
									{displayUser.slackId}
								</p>
							</div>
							<div>
								<label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
									Team ID
								</label>
								<p className="text-neutral-900 dark:text-white font-mono text-sm">
									{displayUser.teamId || "Not provided"}
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
										3
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
			<Footer />
		</GradientBackground>
	);
}
