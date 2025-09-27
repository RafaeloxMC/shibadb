import mongoose, { Schema } from "mongoose";

export interface IGame extends Document {
	ownerSlackId: string;
	name: string;
	description: string;
	uniquePlays: string[];
	createdAt: Date;
	updatedAt: Date;

	totalPlayers: number;
	activePlayers: number;
	totalSessions: number;
	averageSessionTime: number;
	lastPlayedAt?: Date;
}

const GameSchema = new Schema<IGame>({
	ownerSlackId: { type: String },
	name: { type: String },
	description: { type: String },
	uniquePlays: { type: [String] },
	createdAt: { type: Date },
	updatedAt: { type: Date },

	totalPlayers: {
		type: Number,
		default: 0,
	},
	activePlayers: {
		type: Number,
		default: 0,
	},
	totalSessions: {
		type: Number,
		default: 0,
	},
	averageSessionTime: {
		type: Number,
		default: 0,
	},
	lastPlayedAt: {
		type: Date,
		required: false,
	},
});

export default mongoose.models.Game ||
	mongoose.model<IGame>("Game", GameSchema);
