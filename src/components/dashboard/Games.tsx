"use client";
import { IGame } from "@/database/schemas/Game";
import React, { useState } from "react";
import Link from "next/link";
import { Gamepad2, TerminalSquare } from "lucide-react";
import { timeSince } from "@/util/time";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockGames = [
	{
		ownerSlackId: "U1234567890",
		name: "Shiba Runner",
		description:
			"Endless runner with a shiba avatar. Endless runner with a shiba avatar. Endless runner with a shiba avatar. ",
		uniquePlays: [],
		createdAt: new Date(),
		updatedAt: new Date(),
		totalPlayers: 120,
		activePlayers: 12,
		totalSessions: 540,
		averageSessionTime: 300,
		lastPlayedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
		apiKeys: ["SHIBADB-abc123"],
	},
	{
		ownerSlackId: "U0987654321",
		name: "Shiba Puzzle",
		description: "Casual puzzle game starring shibas",
		uniquePlays: [],
		createdAt: new Date(),
		updatedAt: new Date(),
		totalPlayers: 45,
		activePlayers: 5,
		totalSessions: 120,
		averageSessionTime: 420,
		lastPlayedAt: new Date(Date.now() - 30 * 60 * 1000),
		apiKeys: [],
	},
] as unknown as IGame[];

interface GameProps {
	games?: IGame[];
}

export default function Games({ games }: GameProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [error, setError] = useState("");
	const list = games;

	async function submit(name: string, description: string) {
		const res = await fetch("/api/v1/games/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				name: name,
				description: description,
			}),
		});

		if (res.status != 201) {
			const data = await res.json();
			setError(data?.message || "An error occurred.");
		} else {
			if (window != undefined) {
				window.location.reload();
			}
		}
	}

	if (!list || list.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
				<div className="bg-white/70 dark:bg-neutral-800/70 rounded-xl shadow-md px-8 py-10 flex flex-col items-center gap-4">
					<Gamepad2 className="w-10 h-10 text-pink-500" />
					<h2 className="text-2xl font-semibold text-neutral-800 dark:text-white">
						No games found
					</h2>
					<p className="text-neutral-500 dark:text-neutral-400 text-center mb-4">
						You have not added any games yet. Start by creating a
						new game to manage your instances and API keys.
					</p>
					<input
						placeholder="Enter game name"
						className="p-4 rounded-4xl bg-neutral-200 dark:bg-neutral-700 w-full"
						onChange={(e) => setName(e.currentTarget.value)}
					/>
					<textarea
						placeholder="Enter game description"
						className="p-4 rounded-4xl bg-neutral-200 dark:bg-neutral-700 w-full resize-none overflow-scroll h-64"
						onChange={(e) => setDescription(e.currentTarget.value)}
					/>
					{error && <p className="text-red-500">{error}</p>}
					<button
						onClick={() => submit(name, description)}
						className="px-6 py-4 bg-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-pink-600 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300/50 w-1/2"
					>
						Submit
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen max-w-7xl mx-auto px-6 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
					Games
				</h1>
				<p className="text-neutral-600 dark:text-neutral-400">
					Manage your game instances and API keys.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{list.map((game) => (
					<div
						key={game.ownerSlackId + "_" + game.name}
						className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6 hover:shadow-xl transition-all duration-300"
					>
						<div className="flex items-center space-x-3 mb-4">
							<div className="w-12 h-12 aspect-square bg-pink-500/20 rounded-xl flex items-center justify-center">
								<Gamepad2 className="w-6 h-6 text-pink-600 dark:text-pink-400" />
							</div>
							<div className="min-w-0">
								<h3
									className="text-lg font-semibold text-neutral-900 dark:text-white truncate overflow-ellipsis"
									title={game.name}
								>
									{game.name}
								</h3>
								<p
									className="text-sm text-neutral-500 dark:text-neutral-400 truncate overflow-ellipsis"
									title={game.description}
								>
									{game.description}
								</p>
							</div>
						</div>

						<div className="space-y-3">
							<div className="flex justify-between text-sm">
								<span className="text-neutral-600 dark:text-neutral-400">
									Total Players
								</span>
								<span className="font-medium text-neutral-900 dark:text-white">
									{game.totalPlayers ?? 0}
								</span>
							</div>

							<div className="flex justify-between text-sm">
								<span className="text-neutral-600 dark:text-neutral-400">
									Active Players
								</span>
								<span className="font-medium text-neutral-900 dark:text-white">
									{game.activePlayers ?? 0}
								</span>
							</div>

							<div className="flex justify-between text-sm">
								<span className="text-neutral-600 dark:text-neutral-400">
									API Keys
								</span>
								<span className="font-medium text-neutral-900 dark:text-white">
									{(game.apiKeys && game.apiKeys.length) || 0}
								</span>
							</div>

							<div className="flex justify-between text-sm">
								<span className="text-neutral-600 dark:text-neutral-400">
									Last Played
								</span>
								<span className="font-medium text-neutral-900 dark:text-white">
									{timeSince(game.lastPlayedAt)}
								</span>
							</div>
						</div>

						<div className="mt-4 flex gap-3">
							<Link
								href={`/dashboard/games/${encodeURIComponent(
									game._id.toString()
								)}`}
								className="w-full px-4 py-2 bg-pink-500 text-neutral-900 dark:text-white font-medium rounded-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2"
							>
								<TerminalSquare className="w-4 h-4" />
								Manage
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
