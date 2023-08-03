import mongoose, { Document, Schema } from "mongoose";
import { IPerson } from "./Person";

export interface IUser {
  person: IPerson;
  password: string;
}

interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    person: { type: mongoose.Types.ObjectId, required: true, ref: "Person" },
    password: { type: String, required: true },
  },
  { versionKey: false }
);

export default mongoose.model<IUserModel>("User", UserSchema);
