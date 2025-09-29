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
}

async function Dashboard({ page }: DashboardProps) {
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
			const games = await Game.find({ ownerSlackId: user.slackId });
			return games as IGame[];
		} catch {
			console.error("Error while loading user games!");
			return null;
		}
	};

	const user = await getAuthenticatedUser();
	if (!user) {
		redirect("/auth/login");
	}

	let pageComponent;

	if (page == "home") {
		pageComponent = <Home user={user as IUser} />;
	} else if (page == "games") {
		pageComponent = <Games games={(await getUserGames(user)) as IGame[]} />;
	} else {
		pageComponent = <Home user={user as IUser} />;
	}

	return (
		<GradientBackground>
			<main className="flex-grow">{pageComponent}</main>
			<Footer />
		</GradientBackground>
	);
}

export default Dashboard;
