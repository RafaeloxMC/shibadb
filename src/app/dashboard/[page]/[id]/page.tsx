import React from "react";
import Dashboard from "../../page";

async function Page({
	params,
}: {
	params: Promise<{ page: string; id: string }>;
}) {
	return <Dashboard page={(await params).page} id={(await params).id} />;
}

export default Page;
