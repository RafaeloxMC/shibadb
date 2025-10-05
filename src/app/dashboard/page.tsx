export const dynamic = "force-dynamic";

import GradientBackground from "@/components/GradientBackground";
import React from "react";
import Home from "@/components/dashboard/Home";
import { connectDB } from "@/database/database";
import Session from "@/database/schemas/Session";
import User, { IUser } from "@/database/schemas/User";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Footer from "@/components/Footer";
import Games from "@/components/dashboard/Games";
import Game, { IGame } from "@/database/schemas/Game";
import Image from "next/image";
import Link from "next/link";
import GameInfo from "@/components/dashboard/GameInfo";
import Keys from "@/components/dashboard/Keys";
import Players from "@/components/dashboard/Players";
import Database from "@/components/dashboard/Database";
import Save, { ISave } from "@/database/schemas/Save";
import MyData from "@/components/dashboard/My-Data";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

interface DashboardProps {
	page: string | undefined;
	id: string | undefined;
}

async function Dashboard({ page, id }: DashboardProps) {
	if (!page) page = "home";
	const getAuthenticatedUser = async () => {
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
	};

	const getUserGames = async (user: IUser) => {
		try {
			const games = await Game.find({
				ownerSlackId: user.slackId,
			}).lean();

			const plainGames = (games as IGame[]).map((game) => ({
				...game,
				_id: game._id?.toString?.() ?? game._id,
				createdAt:
					game.createdAt instanceof Date
						? game.createdAt.toISOString()
						: game.createdAt,
				updatedAt:
					game.updatedAt instanceof Date
						? game.updatedAt.toISOString()
						: game.updatedAt,
			}));

			return plainGames;
		} catch {
			console.error("Error while loading user games!");
			return null;
		}
	};

	const getUserSaves = async (user: IUser) => {
		try {
			const saves = await Save.find({ playerSlackId: user.slackId });
			return saves as ISave[];
		} catch {
			console.error("Error while loading user saves!");
			return undefined;
		}
	};

	const user = await getAuthenticatedUser();
	if (!user) {
		redirect("/auth/login");
	}

	const saves = await getUserSaves(user);

	let pageComponent;

	if (page == "home") {
		pageComponent = <Home user={user as IUser} saves={saves} />;
	} else if (page == "games") {
		if (id == "") {
			pageComponent = (
				<Games
					games={(await getUserGames(user)) as unknown as IGame[]}
				/>
			);
		} else {
			const game = (await getUserGames(user))?.find(
				(game) => game._id == id
			) as unknown as IGame;

			pageComponent = <GameInfo game={game} />;
		}
	} else if (page == "keys") {
		if (id != "") {
			const game = (await getUserGames(user))?.find(
				(game) => game._id == id
			) as unknown as IGame;
			pageComponent = <Keys gameId={id || ""} apiKeys={game.apiKeys} />;
		}
	} else if (page == "players") {
		if (id != "") {
			const game = (await getUserGames(user))?.find(
				(game) => game._id == id
			) as unknown as IGame;
			pageComponent = (
				<Players
					playerData={{
						totalPlayers: game.totalPlayers,
						activePlayers: game.activePlayers,
						totalSessions: game.totalSessions,
						averageSessionTime: game.averageSessionTime,
						lastPlayedAt: game.lastPlayedAt,
					}}
				/>
			);
		}
	} else if (page == "data") {
		if (id != "") {
			const game = (await getUserGames(user))?.find(
				(game) => game._id == id
			) as unknown as IGame;
			pageComponent = <Database gameId={id || ""} gameName={game.name} />;
		}
	} else if (page == "my-data") {
		pageComponent = <MyData saves={saves} />;
	} else {
		pageComponent = <Home user={user as IUser} saves={saves} />;
	}

	return (
		<GradientBackground>
			<nav className="relative z-20 w-full px-6 py-4 border-b border-neutral-200 dark:border-neutral-700/50">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<Link
						href="/dashboard"
						className="flex items-center space-x-2 group"
					>
						<div className="text-2xl font-black text-pink-600 dark:text-pink-400 transition-colors duration-300 group-hover:text-pink-700 dark:group-hover:text-pink-300">
							ShibaDB
						</div>
						<span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
							Dashboard
						</span>
					</Link>

					<span className="ml-4 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
						Go back
					</span>

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
			<main className="flex-grow items-center justify-center">
				{pageComponent}
			</main>
			<Footer />
		</GradientBackground>
	);
}

export default Dashboard;
