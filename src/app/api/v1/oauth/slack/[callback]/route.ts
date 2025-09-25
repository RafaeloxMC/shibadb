import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { callback: string } }
) {
	const { callback } = await params;

	return NextResponse.json({ oauth: callback });
}
