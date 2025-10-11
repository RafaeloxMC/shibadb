import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/database/database";
import Game from "@/database/schemas/Game";
import Save from "@/database/schemas/Save";
import { checkDefined } from "@/util/definedChecker";
import { requireAuth } from "@/middleware";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB();

		const authResult = await requireAuth(request);

		if ("error" in authResult) {
			return authResult.error;
		}

		const { user } = authResult;

		const { id: gameId } = await params;

		const game = await Game.findById(gameId);
		if (!game) {
			return NextResponse.json(
				{ error: "Game not found" },
				{ status: 404 }
			);
		}

		const saves = await Save.find({
			gameId,
			playerSlackId: user.slackId,
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

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB();

		const authResult = await requireAuth(request);

		if ("error" in authResult) {
			return authResult.error;
		}

		const { user } = authResult;

		const { id: gameId } = await params;
		let body;
		try {
			body = await request.json();
		} catch {
			return NextResponse.json(
				{
					message: "Bad request",
				},
				{ status: 400 }
			);
		}

		const errRes = checkDefined({
			saveData: body.saveData,
		});

		if (errRes) {
			return errRes;
		}

		const { saveName, saveData, version } = body;

		const game = await Game.findById(gameId);
		if (!game) {
			return NextResponse.json(
				{ error: "Game not found" },
				{ status: 404 }
			);
		}

		let save = await Save.findOne({
			gameId,
			playerSlackId: user.slackId,
			saveName: saveName || "Untitled Save",
		});

		if (save) {
			save.saveData = { ...save.saveData, ...saveData };
			save.lastPlayed = new Date();
			if (version) save.version = version;
			await save.save();

			return NextResponse.json({
				success: true,
				message: "Save updated successfully",
				data: save,
			});
		} else {
			save = await Save.create({
				gameId,
				playerSlackId: user.slackId,
				saveName: saveName || "Untitled Save",
				saveData,
				version,
				lastPlayed: new Date(),
			});

			return NextResponse.json(
				{
					success: true,
					message: "Save created successfully",
					data: save,
				},
				{ status: 201 }
			);
		}
	} catch (error) {
		console.error("Error creating/updating save data:", error);
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

		const authResult = await requireAuth(request);

		if ("error" in authResult) {
			return authResult.error;
		}

		const { user } = authResult;

		const { id: gameId } = await params;
		let body;
		try {
			body = await request.json();
		} catch {
			return NextResponse.json(
				{
					message: "Bad request",
				},
				{ status: 400 }
			);
		}

		const errRes = checkDefined({
			saveName: body.saveName,
		});

		if (errRes) {
			return errRes;
		}

		const { saveName } = body;

		const game = await Game.findById(gameId);
		if (!game) {
			return NextResponse.json(
				{ error: "Game not found" },
				{ status: 404 }
			);
		}

		const save = await Save.findOne({
			gameId,
			playerSlackId: user.slackId,
			saveName: saveName || "Untitled Save",
		});

		if (save) {
			await save.deleteOne();

			return NextResponse.json({
				success: true,
				message: "Save deleted successfully",
			});
		} else {
			return NextResponse.json(
				{
					success: false,
					message: "Save not found",
				},
				{ status: 404 }
			);
		}
	} catch (error) {
		console.error("Error deleting save data:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
