import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import GradientBackground from "@/components/GradientBackground";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import React from "react";

function PricingPage() {
	return (
		<GradientBackground>
			<div className="min-h-screen flex flex-col">
				<Navbar />
				<main className="flex flex-col flex-grow">
					<Pricing />
					<CallToAction />
				</main>
				<Footer />
			</div>
		</GradientBackground>
	);
}

export default PricingPage;
