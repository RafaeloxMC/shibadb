import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/middleware";

export async function GET(request: NextRequest) {
	const user = await authenticateUser(request);

	if (!user) {
		return NextResponse.json(
			{ error: "Not authenticated" },
			{ status: 401 }
		);
	}

	return NextResponse.json({ user });
}
