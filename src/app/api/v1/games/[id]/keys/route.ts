import { connectDB } from "@/database/database";
import Game from "@/database/schemas/Game";
import { generateGameToken, getTokenPayload } from "@/util/secureTokens";
import { NextRequest, NextResponse } from "next/server";

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

		const game = await Game.findOne({
			_id: (await params).id,
			ownerSlackId: payload.slackId,
		}).select("-__v");

		if (!game) {
			return NextResponse.json(
				{ error: "Game not found" },
				{ status: 404 }
			);
		}

		const apiKeys = game.apiKeys;
		const newKey = generateGameToken().token;
		apiKeys.push(newKey);
		await game.updateOne({ apiKeys });
		return NextResponse.json({ key: newKey }, { status: 201 });
	} catch (error) {
		console.error("Error fetching game:", error);
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

		const body = await request.json();

		if (!body || body.key == null) {
			return NextResponse.json(
				{
					message: "Bad request",
				},
				{
					status: 400,
				}
			);
		}

		const game = await Game.findOne({
			_id: (await params).id,
		}).select("-__v");

		if (!game) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		if (game.apiKeys.includes(body.key)) {
			return NextResponse.json(
				{
					message: "Valid",
				},
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{
					message: "Not found",
				},
				{ status: 404 }
			);
		}
	} catch (error) {
		console.error("Error fetching game:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
