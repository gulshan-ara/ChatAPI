// models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  online: boolean;
  notificationPreference: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  online: { type: Boolean, default: false },
  notificationPreference: { type: String, default: "push" },
});

export default mongoose.model<IUser>("User", UserSchema);
