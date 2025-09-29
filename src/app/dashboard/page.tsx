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

async function Dashboard() {
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

	const user = await getAuthenticatedUser();
	if (!user) {
		redirect("/auth/login");
	}

	return (
		<GradientBackground>
			<Home user={user as IUser} />
			<Footer />
		</GradientBackground>
	);
}

export default Dashboard;
