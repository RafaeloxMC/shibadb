import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/database/database";
import Game from "@/database/schemas/Game";
import Player from "@/database/schemas/Player";
import { getTokenPayload } from "@/util/secureTokens";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
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

		const resolvedParams = await params;
		const game = await Game.findOne({
			_id: resolvedParams.id,
			userId: payload.userId,
		});

		if (!game) {
			return NextResponse.json(
				{ error: "Game not found" },
				{ status: 404 }
			);
		}

		const url = new URL(request.url);
		const page = parseInt(url.searchParams.get("page") || "1");
		const limit = parseInt(url.searchParams.get("limit") || "10");
		const skip = (page - 1) * limit;

		const [players, total] = await Promise.all([
			Player.find({ gameId: resolvedParams.id })
				.select("-__v")
				.skip(skip)
				.limit(limit)
				.sort({ createdAt: -1 }),
			Player.countDocuments({ gameId: resolvedParams.id }),
		]);

		return NextResponse.json({
			players,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching players:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
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

		const resolvedParams = await params;
		const game = await Game.findOne({
			_id: resolvedParams.id,
			userId: payload.userId,
		});

		if (!game) {
			return NextResponse.json(
				{ error: "Game not found" },
				{ status: 404 }
			);
		}

		const { playerId, ...playerData } = await request.json();

		if (!playerId) {
			return NextResponse.json(
				{ error: "Player ID is required" },
				{ status: 400 }
			);
		}

		const existingPlayer = await Player.findOne({
			gameId: resolvedParams.id,
			playerId,
		});

		if (existingPlayer) {
			return NextResponse.json(
				{ error: "Player already exists" },
				{ status: 409 }
			);
		}

		const newPlayer = new Player({
			gameId: resolvedParams.id,
			playerId,
			...playerData,
		});

		await newPlayer.save();

		game.totalPlayers += 1;
		await game.save();

		return NextResponse.json(
			{ message: "Player added successfully", player: newPlayer },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error adding player:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
