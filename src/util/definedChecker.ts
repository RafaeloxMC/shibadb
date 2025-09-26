/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

function checkDefined(vars: Record<string, unknown>): NextResponse | null {
	const missingFields = Object.entries(vars)
		.filter(([_, value]) => value === undefined)
		.map(([key, _]) => key);

	if (missingFields.length > 0) {
		return NextResponse.json(
			{
				message: "Missing required fields",
				missingFields,
			},
			{ status: 400 }
		);
	}

	return null;
}

function isDefined(vars: Record<string, unknown>): boolean {
	const missingFields = Object.entries(vars)
		.filter(([_, value]) => value === undefined)
		.map(([key, _]) => key);

	return missingFields.length === 0;
}

export { checkDefined, isDefined };
