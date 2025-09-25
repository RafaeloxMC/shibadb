import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json(
		{
			message: "ShibaDB API",
			version: 0.1,
		},
		{ status: 200 }
	);
}
