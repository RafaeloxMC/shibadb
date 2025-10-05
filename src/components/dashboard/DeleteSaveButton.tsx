"use client";
import React from "react";

type Props = { gameId: string; saveName: string };

export default function DeleteSaveButton({ gameId, saveName }: Props) {
	const handleDelete = async () => {
		if (
			!confirm(
				"Are you sure you want to delete this save? This action is irreversible."
			)
		)
			return;
		const res = await fetch(
			`/api/v1/games/${encodeURIComponent(gameId)}/data`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ saveData: { saveName } }),
			}
		);
		if (res.ok) {
			window.location.reload();
		} else {
			alert("Failed to delete the game.");
		}
	};

	return (
		<button
			type="button"
			className="text-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer transition-colors"
			onClick={handleDelete}
		>
			Delete
		</button>
	);
}
