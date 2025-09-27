import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/database/database";
import Game from "@/database/schemas/Game";
import { getTokenPayload } from "@/util/secureTokens";
import { checkDefined } from "@/util/definedChecker";

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const token = request.cookies.get("shibaCookie")?.value;
		if (!token) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const payload = await getTokenPayload(token);
		if (!payload) {
			return NextResponse.json(
				{ error: "Invalid token" },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
		const skip = (page - 1) * limit;

		const games = await Game.find({ userId: payload.userId })
			.sort({ updatedAt: -1 })
			.skip(skip)
			.limit(limit)
			.select("-__v");

		const total = await Game.countDocuments({ userId: payload.userId });

		return NextResponse.json({
			games,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching games:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
