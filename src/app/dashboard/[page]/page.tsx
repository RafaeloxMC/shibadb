import React from "react";
import Dashboard from "../page";

async function Page({ params }: { params: Promise<{ page: string }> }) {
	return <Dashboard page={(await params).page} />;
}

export default Page;
