import mongoose, { Schema, Document } from "mongoose";

export interface IPlayer extends Document {
	gameId: string;
	playerId: string;
	slackId?: string;
	gameData: Record<string, unknown>;
	lastPlayedAt: Date;
	totalPlayTime: number;
	createdAt: Date;
	updatedAt: Date;
}

const PlayerSchema = new Schema<IPlayer>({
	gameId: {
		type: String,
		required: true,
		index: true,
	},
	playerId: {
		type: String,
		required: true,
	},
	slackId: {
		type: String,
		required: false,
	},
	gameData: {
		type: Schema.Types.Mixed,
		default: {},
	},
	lastPlayedAt: {
		type: Date,
		default: Date.now,
	},
	totalPlayTime: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

PlayerSchema.index({ gameId: 1, playerId: 1 }, { unique: true });
PlayerSchema.index({ gameId: 1, lastPlayedAt: -1 });

PlayerSchema.pre("save", function (next) {
	this.updatedAt = new Date();
	next();
});

export default (mongoose.models &&
	(mongoose.models.Player as mongoose.Model<IPlayer>)) ||
	mongoose.model<IPlayer>("Player", PlayerSchema);
