import Footer from "@/components/Footer";
import GradientBackground from "@/components/GradientBackground";
import Navbar from "@/components/Navbar";
import Link from "next/link";

type RouteDoc = {
	method: string;
	path: string;
	description: string;
	requestExample?: string;
	responseExample?: string;
	source?: string;
};

const ROUTES: RouteDoc[] = [
	{
		method: "GET",
		path: "/api/v1",
		description: "API root / status",
		responseExample: `{"message":"ShibaDB API","version":0.1}`,
		source: "/src/app/api/v1/route.ts",
	},
	{
		method: "GET",
		path: "/api/v1/auth/me",
		description:
			"Returns the authenticated user (requires cookie or Authorization header).",
		source: "/src/app/api/v1/auth/me/route.ts",
	},
	{
		method: "GET",
		path: "/api/v1/games",
		description:
			"List games for the authenticated user (pagination & filters supported).",
		source: "/src/app/api/v1/games/route.ts",
	},
	{
		method: "POST",
		path: "/api/v1/games/new",
		description:
			"Create a new game for the authenticated user. Body: { name, description }",
		requestExample: `{"name":"My Game","description":"My amazing game!"}`,
		source: "/src/app/api/v1/games/new/route.ts",
	},
	{
		method: "GET | PUT | DELETE",
		path: "/api/v1/games/:id",
		description:
			"Get, update or delete a single game. PUT accepts { name, description, config }.",
		source: "/src/app/api/v1/games/[id]/route.ts",
	},
	{
		method: "POST",
		path: "/api/v1/games/:id/keys (validate)",
		description:
			"DEPRECATED! Validate an API key for a game (public validation). Body: { key }",
		requestExample: `{"key":"SHIBADB-..."} `,
		source: "/src/app/api/v1/games/[id]/keys/route.ts",
	},
	{
		method: "DELETE",
		path: "/api/v1/games/:id/keys",
		description:
			"DEPRECATED! Remove an API key (owner only). Body: { key }",
		source: "/src/app/api/v1/games/[id]/keys/route.ts",
	},
	{
		method: "GET",
		path: "/api/v1/games/:id/players",
		description: "List players for a game (pagination, sort).",
		source: "/src/app/api/v1/games/[id]/players/route.ts",
	},
	{
		method: "POST",
		path: "/api/v1/games/:id/players",
		description:
			"Create or update a player record (owner only). Body: { playerId, slackId?, gameData?, totalPlayTime? }",
		requestExample: `{"playerId":"player1","gameData": {"score":100}}`,
		source: "/src/app/api/v1/games/[id]/players/route.ts",
	},
	{
		method: "GET | POST",
		path: "/api/v1/games/:id/players/:playerId",
		description:
			"Get or create a specific player. POST can add a new player (owner only).",
		source: "/src/app/api/v1/games/[id]/players/[playerId]/route.ts",
	},
];

function RouteCard({ r }: { r: RouteDoc }) {
	return (
		<div className="bg-white/80 dark:bg-neutral-800/60 rounded-lg p-4 shadow-md border border-neutral-200/50 dark:border-neutral-700/50">
			<div className="flex items-baseline justify-between gap-4">
				<span className="font-mono text-sm text-pink-600 dark:text-pink-400">
					{r.method}
				</span>
				<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
					{r.path}
				</h3>
			</div>
			<p className="text-neutral-600 dark:text-neutral-300 mt-2">
				{r.description}
			</p>
			{r.requestExample && (
				<>
					<label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-3 block">
						Request body
					</label>
					<pre className="bg-neutral-100 dark:bg-neutral-900 rounded-md p-2 mt-1 text-sm overflow-auto">
						<code>{r.requestExample}</code>
					</pre>
				</>
			)}
			{r.responseExample && (
				<>
					<label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-3 block">
						Response example
					</label>
					<pre className="bg-neutral-100 dark:bg-neutral-900 rounded-md p-2 mt-1 text-sm overflow-auto">
						<code>{r.responseExample}</code>
					</pre>
				</>
			)}
			{r.source && (
				<div className="mt-3 text-sm">
					<span className="text-neutral-500 dark:text-neutral-400 block">
						Source: <code className="text-sm">{r.source}</code>
					</span>
				</div>
			)}
		</div>
	);
}

export default function DocsPage() {
	return (
		<GradientBackground>
			<Navbar />
			<div className="min-h-screen py-12 px-6 max-w-5xl mx-auto">
				<h1 className="text-4xl font-bold text-center mb-6 text-neutral-900 dark:text-white">
					API Documentation
				</h1>

				<p className="text-center text-neutral-600 dark:text-neutral-400 mb-8">
					This page lists the current server API routes implemented in
					the codebase. Use the dashboard to manage games & API keys
					and the OAuth flow for authentication.
				</p>

				<h2 className="text-3xl font-bold text-center mb-6 text-neutral-900 dark:text-white">
					Implementation in Godot
				</h2>
				<p className="text-center text-neutral-600 dark:text-neutral-400 mb-8">
					ShibaDB provides a GDScript implementation for simple use.
					The GDScript can be found{" "}
					<Link
						href="https://github.com/RafaeloxMC/shibadb-gdscript"
						className="underline"
					>
						here
					</Link>
					. To implement the script, use the following code:
				</p>

				<pre className="bg-neutral-100 dark:bg-neutral-900 rounded-md p-4 mt-4 mb-8 text-sm overflow-auto">
					<code>
						{`func _ready() -> void:
	# Connect the signal for loading saves to a function in your code
	ShibaDB.save_loaded.connect(_on_save_loaded)
	# Initialize ShibaDB with your Game ID from the dashboard
	await ShibaDB.init_shibadb("GAMEID_HERE")
	# Load the user's saved progress
	ShibaDB.load_progress()
	
func _on_save_loaded(saveData) -> void:
	# Set your variables here! Don't forget to null check these or they might fail
	# Example:
	if saveData.has("coins"):
		coins = int(saveData.coins)
		
func save_progress() -> void:
	# Finally save your progress by calling this function.
	# You can pass as many arguments as you like. Otherwise, you can also pass a Dictionary[String, Variant]
	ShibaDB.save_progress({ "coins": coins })`}
					</code>
				</pre>

				<h2 className="text-3xl font-bold text-center mb-6 text-neutral-900 dark:text-white">
					API Routes
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{ROUTES.map((r) => (
						<RouteCard key={r.path + r.method} r={r} />
					))}
				</div>

				<div className="mt-10 prose text-neutral-900 dark:text-white text-center">
					<h2 className="text-3xl font-bold mb-2">
						Authentication notes
					</h2>
					<p className="text-neutral-600 dark:text-neutral-400">
						Routes that require a logged-in user check for the{" "}
						<code>shibaCookie</code> session cookie or a Bearer
						token in the Authorization header. Sessions are created
						in the Slack callback flow.
					</p>
				</div>
			</div>
			<Footer />
		</GradientBackground>
	);
}
