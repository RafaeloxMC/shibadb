import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/database/database";
import Game from "@/database/schemas/Game";
import Player from "@/database/schemas/Player";
import { getTokenPayload } from "@/util/secureTokens";
import { checkDefined } from "@/util/definedChecker";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
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

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = Math.min(
			parseInt(searchParams.get("limit") || "20"),
			100
		);
		const skip = (page - 1) * limit;
		const sortBy = searchParams.get("sortBy") || "lastPlayedAt";
		const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

		const players = await Player.find({ gameId: params.id })
			.sort({ [sortBy]: sortOrder })
			.skip(skip)
			.limit(limit)
			.select("-__v");

		const total = await Player.countDocuments({ gameId: params.id });

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
	{ params }: { params: { id: string } }
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

		const body = await request.json();

		if (!checkDefined(body.playerId)) {
			return NextResponse.json(
				{ error: "playerId is required" },
				{ status: 400 }
			);
		}

		let player = await Player.findOne({
			gameId: params.id,
			playerId: body.playerId,
		});

		if (player) {
			if (body.gameData) {
				player.gameData = { ...player.gameData, ...body.gameData };
			}
			if (body.slackId) player.slackId = body.slackId;
			if (body.totalPlayTime) player.totalPlayTime += body.totalPlayTime;

			player.lastPlayedAt = new Date();
			await player.save();
		} else {
			player = new Player({
				gameId: params.id,
				playerId: body.playerId,
				slackId: body.slackId,
				gameData: body.gameData || {},
				totalPlayTime: body.totalPlayTime || 0,
			});
			await player.save();

			game.totalPlayers += 1;
			game.lastPlayedAt = new Date();
			await game.save();
		}

		return NextResponse.json({
			message: player.isNew
				? "Player created successfully"
				: "Player updated successfully",
			player: {
				gameId: player.gameId,
				playerId: player.playerId,
				slackId: player.slackId,
				gameData: player.gameData,
				lastPlayedAt: player.lastPlayedAt,
				totalPlayTime: player.totalPlayTime,
			},
		});
	} catch (error) {
		console.error("Error creating/updating player:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
