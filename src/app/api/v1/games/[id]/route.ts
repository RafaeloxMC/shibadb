import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/database/database";
import Game from "@/database/schemas/Game";
import Player from "@/database/schemas/Player";
import { getTokenPayload } from "@/util/secureTokens";
import { checkDefined } from "@/util/definedChecker";

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

		const game = await Game.findOne({
			_id: (await params).id,
			ownerSlackId: payload.userId,
		}).select("-__v");

		if (!game) {
			return NextResponse.json(
				{ error: "Game not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ game });
	} catch (error) {
		console.error("Error fetching game:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function PUT(
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

		const body = await request.json();

		const allowedUpdates = ["name", "description", "config"];
		const updates: Record<string, string | object | Date> = {};

		for (const field of allowedUpdates) {
			if (body[field] !== undefined) {
				if (field === "name" && !checkDefined(body[field])) {
					return NextResponse.json(
						{ error: "Game name is required" },
						{ status: 400 }
					);
				}
				updates[field] = body[field];
			}
		}

		if (Object.keys(updates).length === 0) {
			return NextResponse.json(
				{ error: "No valid fields to update" },
				{ status: 400 }
			);
		}

		updates.updatedAt = new Date();

		const game = await Game.findOneAndUpdate(
			{ _id: (await params).id, ownerSlackId: payload.userId },
			updates,
			{ new: true, runValidators: true }
		).select("-__v");

		if (!game) {
			return NextResponse.json(
				{ error: "Game not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			message: "Game updated successfully",
			game,
		});
	} catch (error) {
		console.error("Error updating game:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
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

		const game = await Game.findOneAndDelete({
			_id: (await params).id,
			ownerSlackId: payload.userId,
		});

		if (!game) {
			return NextResponse.json(
				{ error: "Game not found" },
				{ status: 404 }
			);
		}

		await Player.deleteMany({ gameId: (await params).id });

		return NextResponse.json({
			message: "Game and associated data deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting game:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
