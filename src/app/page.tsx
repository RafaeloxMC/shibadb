import GradientBackground from "../components/GradientBackground";
import Navbar from "../components/Navbar";
import Description from "../components/Description";
import Features from "../components/Features";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

export default function Home() {
	return (
		<GradientBackground>
			<div className="min-h-screen flex flex-col">
				<Navbar />
				<main className="flex flex-col flex-grow">
					<Description />
					<Features />
					<CallToAction />
				</main>
				<Footer />
			</div>
		</GradientBackground>
	);
}
