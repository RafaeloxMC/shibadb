"use client";
import React, { useState } from "react";

interface KeysProps {
	gameId: string;
	apiKeys?: string[];
}

export default function Keys({ gameId, apiKeys = [] }: KeysProps) {
	const [count, setCount] = useState<number>(apiKeys.length || 0);
	const [creating, setCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [recentKey, setRecentKey] = useState<string | null>(null);
	const [showRecent, setShowRecent] = useState(true);
	const [revoking, setRevoking] = useState(false);

	const [showRevokeForm, setShowRevokeForm] = useState(false);
	const [revokeInput, setRevokeInput] = useState("");
	const [revokeIndex, setRevokeIndex] = useState<number | null>(null);
	const [revealRevoke, setRevealRevoke] = useState(false);

	const [copyButtonText, setCopyButtonText] = useState("Copy");

	async function createKey() {
		setCreating(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/v1/games/${encodeURIComponent(gameId)}/keys`,
				{
					method: "PUT",
					credentials: "include",
				}
			);
			const data = await res.json();
			if (!res.ok) {
				setError(
					data?.error || data?.message || "Failed to create key"
				);
				return;
			}
			const newKey = data?.key ?? null;
			if (newKey) {
				setRecentKey(newKey);
				setShowRecent(true);
				setCount((c) => c + 1);
			} else {
				setCount((c) => c + 1);
			}
		} catch (err) {
			console.error(err);
			setError("Network error");
		} finally {
			setCreating(false);
		}
	}

	async function confirmRevoke() {
		if (!revokeInput.trim()) {
			setError("Please enter the full API key to revoke.");
			return;
		}
		setRevoking(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/v1/games/${encodeURIComponent(gameId)}/keys`,
				{
					method: "DELETE",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ key: revokeInput.trim() }),
				}
			);
			const data = await res.json();
			if (!res.ok) {
				setError(
					data?.error || data?.message || "Failed to revoke key"
				);
				return;
			}
			setCount((c) => Math.max(0, c - 1));
			if (revokeInput.trim() === recentKey) {
				setRecentKey(null);
				setShowRecent(false);
			}
			setRevokeInput("");
			setRevokeIndex(null);
			setShowRevokeForm(false);
			setRevealRevoke(false);
		} catch (err) {
			console.error(err);
			setError("Network error");
		} finally {
			setRevoking(false);
		}
	}

	function openRevokeForm(index?: number | null) {
		setRevokeIndex(index ?? null);
		setShowRevokeForm(true);
		setRevokeInput("");
		setRevealRevoke(false);
		setError(null);
	}

	async function revokeAll() {
		const res = await fetch(
			`/api/v1/games/${encodeURIComponent(gameId)}/keys`,
			{
				method: "DELETE",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					key: "DELETE_ALL_THIS_ACTION_IS_IRREVERSIBLE",
				}),
			}
		);
		const data = await res.json();

		if (!res.ok) {
			setError(
				data?.error || data?.message || "Failed to revoke all keys"
			);
			return;
		}
		setCount(0);
	}

	function copyRecent() {
		if (!recentKey) return;
		navigator.clipboard?.writeText(recentKey);
	}

	return (
		<div className="m-6">
			<div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 p-6 mx-auto w-full max-w-7xl">
				<div className="w-full">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
								API Keys
							</h3>
							<p className="text-sm text-neutral-500 dark:text-neutral-400">
								Manage your API keys for this game. Keys are
								shown only once right after creation.
							</p>
						</div>
						<div className="flex items-center gap-2">
							<button
								className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-200 cursor-pointer"
								onClick={createKey}
								disabled={creating}
							>
								{creating ? "Creating..." : "Create key"}
							</button>
							<button
								className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 hover:dark:bg-neutral-800 cursor-pointer rounded-lg transition-colors duration-200"
								onClick={() => openRevokeForm(null)}
								disabled={revoking}
							>
								{revoking ? "Revoking..." : "Revoke key"}
							</button>
							<button
								className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 hover:dark:bg-neutral-800 cursor-pointer rounded-lg transition-colors duration-200"
								onClick={() => revokeAll()}
								disabled={revoking}
							>
								{revoking ? "Revoking..." : "Revoke all"}
							</button>
						</div>
					</div>

					{showRevokeForm && (
						<div className="mb-4 p-4 bg-neutral-50 dark:bg-neutral-900/20 rounded-lg border border-neutral-100 dark:border-neutral-700/30">
							<div className="flex flex-col md:flex-row md:items-center gap-3">
								<div className="flex-1">
									<label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
										Enter API key to revoke
									</label>
									<div className="mt-2 flex items-center gap-2">
										<input
											type={
												revealRevoke
													? "text"
													: "password"
											}
											className="flex-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-2 text-sm text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-400"
											placeholder={
												revokeIndex
													? `Full key for API Key #${revokeIndex}`
													: "Paste the full API key to revoke"
											}
											value={revokeInput}
											onChange={(e) =>
												setRevokeInput(e.target.value)
											}
										/>
										<button
											className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-800 rounded-lg text-sm cursor-pointer transition-colors duration-200"
											type="button"
											onClick={() =>
												setRevealRevoke((s) => !s)
											}
										>
											{revealRevoke ? "Hide" : "Show"}
										</button>
									</div>
									<p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
										This will permanently remove the key.
										You must enter the full API key string
										to confirm.
									</p>
								</div>
								<div className="flex gap-2 items-center mt-2">
									<button
										className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm cursor-pointer"
										onClick={confirmRevoke}
										disabled={revoking}
									>
										{revoking
											? "Revoking..."
											: "Confirm Revoke"}
									</button>
									<button
										className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-800 rounded-lg text-sm cursor-pointer transition-colors duration-200"
										onClick={() => {
											setShowRevokeForm(false);
											setRevokeInput("");
											setRevokeIndex(null);
											setRevealRevoke(false);
										}}
										disabled={revoking}
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					)}

					<div className="mb-4">
						<span className="text-sm text-neutral-600 dark:text-neutral-400">
							Active keys:
						</span>
						<div className="mt-2 grid gap-2">
							{Array.from({ length: count }).map((_, i) => (
								<div
									key={i}
									className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/30 p-3 rounded-lg border border-neutral-100 dark:border-neutral-700/30"
								>
									<div>
										<span className="text-sm text-neutral-700 dark:text-white">
											API Key #{i + 1}
										</span>
										<p className="text-xs text-neutral-500 dark:text-neutral-400">
											(kept hidden for security)
										</p>
									</div>
									<button
										className="text-sm text-red-600 hover:underline"
										onClick={() => openRevokeForm(i + 1)}
									>
										Revoke
									</button>
								</div>
							))}
							{count === 0 && (
								<div className="text-sm text-neutral-500">
									No active keys.
								</div>
							)}
						</div>
					</div>

					{showRecent && recentKey && (
						<div className="mb-4 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-sm font-medium text-pink-800 dark:text-pink-200">
										New API key — save it now
									</p>
									<p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
										This key will not be shown again. Copy
										and store it securely.
									</p>
									<pre className="bg-white dark:bg-neutral-800 p-2 rounded mt-2 text-xs break-all">
										{recentKey}
									</pre>
								</div>
								<div className="flex flex-row items-end gap-2">
									<button
										className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg cursor-pointer hover:bg-green-600 transition-colors duration-200"
										onClick={() => {
											copyRecent();
											setCopyButtonText("Copied!");
											setTimeout(
												() => setCopyButtonText("Copy"),
												1000
											);
										}}
									>
										{copyButtonText}
									</button>
									<button
										className="px-3 py-2 bg-neutral-200 dark:bg-neutral-700 text-sm rounded-lg cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-800 transition-colors duration-200"
										onClick={() => setShowRecent(false)}
									>
										Dismiss
									</button>
								</div>
							</div>
						</div>
					)}

					{error && (
						<div className="text-sm text-red-500 mt-2">{error}</div>
					)}
				</div>
			</div>
		</div>
	);
}
