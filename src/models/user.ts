import mongoose, { Document, Schema } from "mongoose";
import { IPerson } from "./person";
import uniqueValidator from "mongoose-unique-validator";

export interface IUser {
  person: IPerson;
  password: string;
  token?: string;
}

interface IUserModel extends IUser, Document { }

const UserSchema: Schema = new Schema(
  {
    person: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Person",
      unique: true,
      trim: true,
    },
    token: { type: String },
    password: { type: String, required: true, select: false },
  },
  { versionKey: false, timestamps: true }
);
UserSchema.plugin(uniqueValidator);
export default mongoose.model<IUserModel>("User", UserSchema);
