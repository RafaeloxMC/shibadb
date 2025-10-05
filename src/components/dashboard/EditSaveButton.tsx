"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditSaveButtonProps {
	gameId: string;
	saveId: string;
	saveName: string;
	saveData: Record<string, unknown>;
	lastPlayed: Date;
}

export default function EditSaveButton({
	gameId,
	saveId,
	saveName,
	saveData,
	lastPlayed,
}: EditSaveButtonProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState(
		JSON.stringify(saveData, null, 2)
	);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSave = async () => {
		setSaving(true);
		setError(null);

		try {
			const parsedData = JSON.parse(editedData);

			const response = await fetch(`/api/v1/games/${gameId}/data`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					saveName,
					saveData: parsedData,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to update save");
			}

			setIsEditing(false);
			router.refresh();
		} catch (err) {
			if (err instanceof SyntaxError) {
				setError("Invalid JSON format");
			} else {
				setError(err instanceof Error ? err.message : "Failed to save");
			}
		} finally {
			setSaving(false);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setError(null);
		setEditedData(JSON.stringify(saveData, null, 2));
	};

	return (
		<div className="w-full">
			<div className="flex items-start justify-between mb-3">
				<div className="flex-1">
					<h3 className="font-semibold text-neutral-900 dark:text-white">
						{saveName || "Untitled Save"}
					</h3>
					<p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
						Last played: {new Date(lastPlayed).toLocaleString()}
					</p>
				</div>
				<div className="flex gap-2">
					{isEditing ? (
						<>
							<button
								onClick={handleCancel}
								disabled={saving}
								className="px-3 py-1 text-sm bg-neutral-200 hover:bg-neutral-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors duration-200"
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								disabled={saving}
								className="opacity-100 px-3 py-1 text-sm bg-pink-500 hover:opacity-80 transition-opacity duration-200 disabled:bg-pink-500 text-white rounded-lg flex items-center gap-2"
							>
								{saving ? (
									<>
										<svg
											className="animate-spin h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											/>
										</svg>
										Saving...
									</>
								) : (
									<>
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
										Save
									</>
								)}
							</button>
						</>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className="px-3 py-1 text-sm bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								/>
							</svg>
							Edit
						</button>
					)}
				</div>
			</div>

			<div className="bg-neutral-50 dark:bg-neutral-900 rounded p-3 mt-2">
				{isEditing ? (
					<textarea
						value={editedData}
						onChange={(e) => setEditedData(e.target.value)}
						className="w-full h-64 p-3 font-mono text-xs bg-white dark:bg-neutral-800 border-2 border-pink-300 dark:border-pink-600 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-neutral-900 dark:text-white resize-none"
						spellCheck={false}
					/>
				) : (
					<pre className="text-xs text-neutral-600 dark:text-neutral-400 overflow-x-auto max-h-64">
						{JSON.stringify(saveData, null, 2)}
					</pre>
				)}
			</div>

			{error && (
				<p className="mt-2 text-sm text-red-600 dark:text-red-400">
					{error}
				</p>
			)}
		</div>
	);
}
