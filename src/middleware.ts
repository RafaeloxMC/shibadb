import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/database/database";
import Session from "@/database/schemas/Session";
import User, { IUser } from "@/database/schemas/User";

export interface AuthenticatedRequest extends NextRequest {
	user?: IUser;
}

export async function authenticateUser(
	request: NextRequest
): Promise<IUser | null> {
	try {
		let token = request.cookies.get("shibaCookie")?.value;

		if (!token) {
			console.log("No shibaCookie found!");
			const authHeader = request.headers.get("Authorization");
			if (authHeader?.startsWith("Bearer ")) {
				token = authHeader.substring(7);
			} else {
				console.log("No auth header found!");
			}
		}

		if (!token) {
			return null;
		}

		await connectDB();

		const session = await Session.findOne({
			token,
			expiresAt: { $gt: new Date() },
		});

		if (!session) {
			return null;
		}

		const user = await User.findById(session.userId);

		return user;
	} catch (error) {
		console.error("Authentication error:", error);
		return null;
	}
}

export async function requireAuth(
	request: NextRequest
): Promise<{ user: IUser } | { error: Response }> {
	const user = await authenticateUser(request);

	if (!user) {
		return {
			error: new Response(
				JSON.stringify({ message: "Authentication required" }),
				{
					status: 401,
					headers: { "Content-Type": "application/json" },
				}
			),
		};
	}

	return { user };
}

const allowedOriginPatterns = [
	/^https:\/\/.*\.selfhosted\.hackclub\.com$/,
	/^http:\/\/localhost:\d+$/,
	"https://shiba.hackclub.dev",
	"https://shiba.hackclub.com",
	/^https:\/\/.*\.github\.io$/,
];

function isOriginAllowed(origin: string | null): boolean {
	if (!origin) return false;

	return allowedOriginPatterns.some((pattern) => {
		if (typeof pattern === "string") {
			return origin === pattern;
		}
		return pattern.test(origin);
	});
}

export async function middleware(request: NextRequest) {
	const origin = request.headers.get("origin");
	const allowedOrigin = isOriginAllowed(origin) ? origin || "" : "";

	if (request.method === "OPTIONS") {
		return new NextResponse(null, {
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": allowedOrigin,
				"Access-Control-Allow-Methods":
					"GET, POST, PUT, DELETE, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
				"Access-Control-Allow-Credentials": "true",
			},
		});
	}

	const response = NextResponse.next();

	if (allowedOrigin) {
		response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
		response.headers.set(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, DELETE, OPTIONS"
		);
		response.headers.set(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization"
		);
		response.headers.set("Access-Control-Allow-Credentials", "true");
	}

	return response;
}
