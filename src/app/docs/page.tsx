import Footer from "@/components/Footer";
import GradientBackground from "@/components/GradientBackground";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const docsSections = [
	{
		id: "introduction",
		title: "Introduction",
		content: (
			<div>
				<p>
					Welcome to the ShibaDB documentation. This guide will help
					you get started with our platform.
				</p>
				<p>
					ShibaDB is the ultimate database service for game developers
					in the Hackclub Shiba programme.
				</p>
				<p>
					<span className="font-bold">Please Note:</span> This is very
					WIP and the API will receive breaking changes!
				</p>
			</div>
		),
	},
	{
		id: "getting-started",
		title: "Getting Started",
		content: (
			<div>
				<h3 className="bold">Installation</h3>
				<span className="italic">Placeholder data:</span>
				<p>
					Login to the <Link href={"/dashboard"}>dashboard</Link> to
					create an API key
				</p>
				<p>
					Pass the API key when creating the instance of ShibaDB in
					Godot
				</p>
			</div>
		),
	},
	{
		id: "api-reference",
		title: "API Reference",
		content: (
			<div>
				<h3 className="bold">Core Functions</h3>
				<span className="italic">Placeholder data:</span>
				<ul>
					<li>
						<strong>connect(url)</strong>: Establishes a connection
						to the database.
					</li>
					<li>
						<strong>query(sql)</strong>: Executes a SQL query.
					</li>
					<li>
						<strong>disconnect()</strong>: Closes the connection.
					</li>
				</ul>
			</div>
		),
	},
];

export default function DocsPage() {
	return (
		<GradientBackground>
			<Navbar />
			<div className="min-h-screen py-12 px-6 max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-center mb-8 text-neutral-900 dark:text-white">
					Documentation
				</h1>
				<div className="space-y-12">
					{docsSections.map((section) => (
						<section
							key={section.id}
							id={section.id}
							className="bg-neutral-50 dark:bg-neutral-800/50 backdrop-blur-md rounded-lg p-6 shadow-lg"
						>
							<h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">
								{section.title}
							</h2>
							<div className="text-neutral-700 dark:text-neutral-200 prose max-w-none">
								{section.content}
							</div>
						</section>
					))}
				</div>
			</div>
			<Footer />
		</GradientBackground>
	);
}
