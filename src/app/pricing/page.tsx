import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import GradientBackground from "@/components/GradientBackground";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import React from "react";

function PricingPage() {
	return (
		<GradientBackground>
			<Navbar />
			<main className="flex flex-col flex-grow">
				<Pricing />
				<CallToAction />
			</main>
			<Footer />
		</GradientBackground>
	);
}

export default PricingPage;
