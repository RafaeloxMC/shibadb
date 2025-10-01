import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/database/database";
import Game from "@/database/schemas/Game";
import Save from "@/database/schemas/Save";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB();

		const { id: gameId } = await params;
		const slackId = request.headers.get("x-slack-user-id");
		const playerSlackId = request.nextUrl.searchParams.get("playerSlackId");

		if (!slackId) {
			return NextResponse.json(
				{ error: "Slack user ID is required" },
				{ status: 401 }
			);
		}

		if (!playerSlackId) {
			return NextResponse.json(
				{ error: "playerSlackId query parameter is required" },
				{ status: 400 }
			);
		}

		const game = await Game.findById(gameId);
		if (!game) {
			return NextResponse.json(
				{ error: "Game not found" },
				{ status: 404 }
			);
		}

		const isCreator = game.ownerSlackId === slackId;
		const isPlayer = playerSlackId === slackId;

		if (!isCreator && !isPlayer) {
			return NextResponse.json(
				{
					error: "Unauthorized",
				},
				{ status: 403 }
			);
		}

		const saves = await Save.find({
			gameId,
			playerSlackId,
		}).sort({ lastPlayed: -1 });

		return NextResponse.json({
			success: true,
			data: saves,
		});
	} catch (error) {
		console.error("Error fetching save data:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
