import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/database/database";
import Session from "@/database/schemas/Session";

export async function POST(request: NextRequest) {
	const token = request.cookies.get("session_token")?.value;

	if (token) {
		try {
			await connectDB();
			await Session.deleteOne({ token });
		} catch (error) {
			console.error("Logout error:", error);
		}
	}

	const response = NextResponse.json({ message: "Logged out successfully" });
	response.cookies.delete("session_token");

	return response;
}
