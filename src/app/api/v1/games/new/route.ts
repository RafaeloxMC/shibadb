import { requireAuth } from "@/app/middleware";
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
	});

	if (errRes) {
		return errRes;
	}

	// TODO: Create game with user as owner

	return NextResponse.json(
		{
			message: "Created",
			owner: user.name || user.slackId,
		},
		{ status: 201 }
	);
}
