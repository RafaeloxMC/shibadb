import { connectDB } from "@/database/database";
import Game, { IGame } from "@/database/schemas/Game";
import { timeSince } from "./time";

export async function getDashboardData(ownerSlackId: string) {
	try {
		await connectDB();

		const games = (await Game.find({ ownerSlackId })
			.select(
				"name totalPlayers activePlayers totalSessions averageSessionTime lastPlayedAt apiKeys createdAt"
			)
			.lean()) as IGame[];

		const totalGames = games.length;
		const totalPlayers = games.reduce(
			(sum, game) => sum + (game.totalPlayers || 0),
			0
		);
		const activePlayers = games.reduce(
			(sum, game) => sum + (game.activePlayers || 0),
			0
		);

		const lastPlayedGame = games
			.filter((game) => game.lastPlayedAt)
			.sort(
				(a, b) =>
					new Date(b.lastPlayedAt!).getTime() -
					new Date(a.lastPlayedAt!).getTime()
			)[0] || { lastPlayedAt: undefined };

		const avgSessionTime =
			games.length > 0
				? Math.round(
						games.reduce(
							(sum, game) => sum + (game.averageSessionTime || 0),
							0
						) / games.length
				  )
				: 0;

		let keyAmount = 0;
		for (const game of games as IGame[]) {
			keyAmount += game.apiKeys.length;
		}

		return {
			totalGames,
			totalPlayers,
			activePlayers,
			lastPlayed: timeSince(lastPlayedGame.lastPlayedAt),
			averageSessionTime:
				avgSessionTime > 0
					? `${Math.round(avgSessionTime / 60)} min`
					: "0 min",
			keyAmount,
			games: games.map((game) => ({
				id: game._id?.toString(),
				name: game.name,
				totalPlayers: game.totalPlayers || 0,
				activePlayers: game.activePlayers || 0,
				totalSessions: game.totalSessions || 0,
				apiKeys: game.apiKeys?.length || 0,
				lastPlayedAt: game.lastPlayedAt,
				createdAt: game.createdAt,
			})),
		};
	} catch (error) {
		console.error("Error fetching dashboard data:", error);
		return {
			totalGames: 0,
			totalPlayers: 0,
			activePlayers: 0,
			lastPlayed: "N/A",
			averageSessionTime: "N/A",
			keyAmount: 0,
			games: [],
		};
	}
}
