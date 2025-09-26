import GradientBackground from "@/components/GradientBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Slack } from "lucide-react";

export default function LoginPage() {
	return (
		<GradientBackground>
			<div className="min-h-screen flex flex-col">
				<Navbar />
				<main className="flex flex-col flex-grow justify-center items-center py-16">
					<div className="max-w-md w-full mx-auto">
						<div className="text-center mb-8">
							<h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
								Welcome to ShibaDB
							</h1>
							<p className="text-lg text-neutral-600 dark:text-neutral-400">
								Sign in with your Slack account to get started
							</p>
						</div>

						<div className="bg-white/70 dark:bg-neutral-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-neutral-700/30">
							<a
								href="/api/v1/auth/slack"
								className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 space-x-3"
							>
								<Slack />
								<span>Continue with Slack</span>
							</a>
						</div>
					</div>
				</main>
				<Footer />
			</div>
		</GradientBackground>
	);
}
