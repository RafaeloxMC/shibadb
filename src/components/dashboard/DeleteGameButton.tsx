"use client";
import React from "react";

type Props = { gameId: string };

export default function DeleteGameButton({ gameId }: Props) {
	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this game?")) return;
		const res = await fetch(`/api/v1/games/${encodeURIComponent(gameId)}`, {
			method: "DELETE",
		});
		if (res.ok) {
			window.location.href = "/dashboard/games";
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
