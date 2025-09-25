import { checkDefined } from "@/util/definedChecker";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const body = await request.json();

	const errRes = checkDefined({
		name: body.name,
	});

	if (errRes) {
		return errRes;
	}

	return NextResponse.json(
		{
			message: "Created",
		},
		{ status: 201 }
	);
}
