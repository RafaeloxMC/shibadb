import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	slackId: string;
	email?: string;
	name?: string;
	avatar?: string;
	teamId?: string;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
	slackId: { type: String, required: true, unique: true },
	email: { type: String },
	name: { type: String },
	avatar: { type: String },
	teamId: { type: String },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export default (mongoose.models.User as mongoose.Model<IUser>) ||
	mongoose.model<IUser>("User", UserSchema);
