import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
	token: string;
	userId: string;
	slackId: string;
	expiresAt: Date;
	createdAt: Date;
}

const SessionSchema = new Schema<ISession>({
	token: { type: String, required: true, unique: true },
	userId: { type: String, required: true },
	slackId: { type: String, required: true },
	expiresAt: { type: Date, required: true },
	createdAt: { type: Date, default: Date.now },
});

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default (mongoose.models.Session as mongoose.Model<ISession>) ||
	mongoose.model<ISession>("Session", SessionSchema);
