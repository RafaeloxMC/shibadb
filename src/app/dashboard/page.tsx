import { cookies } from "next/headers";
import { connectDB } from "@/database/database";
import Session from "@/database/schemas/Session";
import User, { IUser } from "@/database/schemas/User";
import GradientBackground from "@/components/GradientBackground";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { redirect } from "next/navigation";

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
		const token = cookieStore.get("session_token")?.value;

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

export default async function Dashboard() {
	const user = await getAuthenticatedUser();

	const displayUser = user || mockUser;

	if (!user) {
		redirect("/auth/login");
	}

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
									<svg
										className="w-6 h-6 text-pink-600 dark:text-pink-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 000-6h-1m4 6V4a3 3 0 000-6M7 16l3-3 3 3m-3-3v4"
										/>
									</svg>
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
										12
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-neutral-600 dark:text-neutral-400">
										Total Players
									</span>
									<span className="font-medium text-neutral-900 dark:text-white">
										247
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
									<svg
										className="w-6 h-6 text-blue-600 dark:text-blue-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
										/>
									</svg>
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
										1,247
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-neutral-600 dark:text-neutral-400">
										Active Today
									</span>
									<span className="font-medium text-neutral-900 dark:text-white">
										89
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
									<svg
										className="w-6 h-6 text-green-600 dark:text-green-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
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
									<svg
										className="w-6 h-6 text-purple-600 dark:text-purple-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
										/>
									</svg>
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
									<svg
										className="w-6 h-6 text-orange-600 dark:text-orange-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
										/>
									</svg>
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
										2 minutes ago
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-neutral-600 dark:text-neutral-400">
										Average Time
									</span>
									<span className="font-medium text-neutral-900 dark:text-white">
										14 min
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
									<svg
										className="w-6 h-6 text-neutral-600 dark:text-neutral-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
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
