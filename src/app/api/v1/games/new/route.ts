import { requireAuth } from "@/middleware";
import Game from "@/database/schemas/Game";
import { checkDefined } from "@/util/definedChecker";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const authResult = await requireAuth(request);

	if ("error" in authResult) {
		return authResult.error;
	}

	const { user } = authResult;
	const body = await request.json();

	const errRes = checkDefined({
		name: body.name,
		description: body.description,
	});

	if (errRes) {
		return errRes;
	}

	const { name, description } = body;

	const game = await Game.create({
		ownerSlackId: user.slackId,
		name: name,
		description: description,
		uniquePlays: [],
		createdAt: Date.now(),
		updatedAt: Date.now(),
	});

	return NextResponse.json(
		{
			message: "Created",
			game,
		},
		{ status: 201 }
	);
}
