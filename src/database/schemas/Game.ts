import mongoose, { Schema } from "mongoose";

export interface IGame extends Document {
	ownerSlackId: string;
	name: string;
	description: string;
	uniquePlays: string[];
	createdAt: Date;
	updatedAt: Date;
}

export const GameSchema = new Schema<IGame>({
	ownerSlackId: { type: String },
	name: { type: String },
	description: { type: String },
	uniquePlays: { type: [String] },
	createdAt: { type: Date },
	updatedAt: { type: Date },
});

export default mongoose.models.Game ||
	mongoose.model<IGame>("Game", GameSchema);
