import mongoose, { Schema, model, Document } from "mongoose";

export interface ISave extends Document {
	gameId: string;
	playerSlackId: string;
	saveName: string;
	saveData: Record<string, unknown>;
	version?: string;
	lastPlayed: Date;
	createdAt: Date;
	updatedAt: Date;
}

const SaveSchema = new Schema<ISave>(
	{
		gameId: {
			type: String,
			required: true,
			index: true,
		},
		playerSlackId: {
			type: String,
			required: true,
			index: true,
		},
		saveName: {
			type: String,
			required: true,
			default: "Untitled Save",
		},
		saveData: {
			type: Schema.Types.Mixed,
			required: true,
			default: {},
		},
		version: {
			type: String,
			required: false,
		},
		lastPlayed: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

SaveSchema.index({ gameId: 1, userId: 1 });

SaveSchema.methods.updateSaveData = function (
	newData: Partial<Record<string, unknown>>
) {
	this.saveData = { ...this.saveData, ...newData };
	this.lastPlayed = new Date();
	return this.save();
};

export default (mongoose.models &&
	(mongoose.models.Save as mongoose.Model<ISave>)) ||
	model<ISave>("Save", SaveSchema);
