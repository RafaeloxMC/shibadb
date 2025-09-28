import { connectDB } from "@/database/database";
import Session from "@/database/schemas/Session";
import { randomBytes } from "crypto";

export function generateSecureToken(): string {
	return randomBytes(32).toString("hex");
}

export function generateTokenWithExpiry(hours: number = 24 * 7) {
	return {
		token: generateSecureToken(),
		expiresAt: new Date(Date.now() + hours * 60 * 60 * 1000),
	};
}

export async function getTokenPayload(
	token: string
): Promise<{ userId: string; slackId: string } | null> {
	try {
		await connectDB();

		const session = await Session.findOne({
			token,
			expiresAt: { $gt: new Date() },
		});

		if (!session) {
			return null;
		}

		return {
			userId: session.userId,
			slackId: session.slackId,
		};
	} catch (error) {
		console.error("Error validating token:", error);
		return null;
	}
}
