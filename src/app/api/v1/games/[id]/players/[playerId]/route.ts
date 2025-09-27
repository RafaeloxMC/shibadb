import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/database/database";
import Game from "@/database/schemas/Game";
import Player from "@/database/schemas/Player";
import { getTokenPayload } from "@/util/secureTokens";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string; playerId: string } }
) {
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

		const game = await Game.findOne({
			_id: params.id,
			userId: payload.userId,
		});

		if (!game) {
			return NextResponse.json(
				{ error: "Game not found" },
				{ status: 404 }
			);
		}

		const player = await Player.findOne({
			gameId: params.id,
			playerId: params.playerId,
		}).select("-__v");

		if (!player) {
			return NextResponse.json(
				{ error: "Player not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ player });
	} catch (error) {
		console.error("Error fetching player:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string; playerId: string } }
) {
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

		const game = await Game.findOne({
			_id: params.id,
			userId: payload.userId,
		});

		if (!game) {
			return NextResponse.json(
				{ error: "Game not found" },
				{ status: 404 }
			);
		}

		const player = await Player.findOneAndDelete({
			gameId: params.id,
			playerId: params.playerId,
		});

		if (!player) {
			return NextResponse.json(
				{ error: "Player not found" },
				{ status: 404 }
			);
		}

		game.totalPlayers = Math.max(0, game.totalPlayers - 1);
		await game.save();

		return NextResponse.json({
			message: "Player data deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting player:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
