import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/database/database";
import { generateTokenWithExpiry } from "@/util/secureTokens";
import Session from "@/database/schemas/Session";
import User from "@/database/schemas/User";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");
	const error = searchParams.get("error");

	if (error) {
		return NextResponse.redirect(
			`${
				process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
			}/login?error=access_denied`
		);
	}

	if (!code) {
		return NextResponse.redirect(
			`${
				process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
			}/login?error=no_code`
		);
	}

	try {
		const tokenResponse = await fetch(
			"https://slack.com/api/oauth.v2.access",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Basic ${Buffer.from(
						`${process.env.SLACK_CLIENT_ID}:${process.env.SLACK_SECRET}`
					).toString("base64")}`,
				},
				body: new URLSearchParams({
					code,
					redirect_uri: `${
						process.env.NEXT_PUBLIC_BASE_URL ||
						"http://localhost:3000"
					}/api/v1/auth/slack/callback`,
				}),
			}
		);

		const tokenData = await tokenResponse.json();

		if (!tokenData.ok) {
			console.error("Slack OAuth error:", tokenData.error);
			return NextResponse.redirect(
				`${
					process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
				}/login?error=oauth_error`
			);
		}

		const userResponse = await fetch(
			"https://slack.com/api/users.identity",
			{
				headers: {
					Authorization: `Bearer ${tokenData.authed_user.access_token}`,
				},
			}
		);

		const userData = await userResponse.json();

		if (!userData.ok) {
			console.error("Slack user info error:", userData.error);
			return NextResponse.redirect(
				`${
					process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
				}/login?error=user_info_error`
			);
		}

		await connectDB();

		const user = await User.findOneAndUpdate(
			{ slackId: userData.user.id },
			{
				slackId: userData.user.id,
				email: userData.user.email,
				name: userData.user.name,
				avatar: userData.user.image_192,
				teamId: tokenData.team?.id,
				updatedAt: new Date(),
			},
			{ upsert: true, new: true }
		);

		const { token, expiresAt } = generateTokenWithExpiry(24 * 7);

		await Session.create({
			token,
			userId: user._id.toString(),
			expiresAt,
		});

		const response = NextResponse.redirect(
			`${
				process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
			}/dashboard`
		);

		response.cookies.set("session_token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60,
			path: "/",
		});

		return response;
	} catch (error) {
		console.error("OAuth callback error:", error);
		return NextResponse.redirect(
			`${
				process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
			}/login?error=server_error`
		);
	}
}
