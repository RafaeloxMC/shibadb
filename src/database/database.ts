import mongoose, { Mongoose } from "mongoose";

let conn: Mongoose | undefined;

export async function connectDB() {
	if (!process.env.MONGO_URI) {
		console.error(
			"MONGO_URI not found in .env! API will not connect to DB!"
		);
		return;
	}

	if (conn != undefined) return;
	conn = await mongoose.connect(process.env.MONGO_URI ?? "");

	if (conn && conn.connection != null) {
		console.log("Connected to MongoDB!");
	}
}
