import mongoose, { Document, Schema } from "mongoose";

export interface IPerson {
  name: string;
  username?: string;
  contact: string;
  nationalId?: string;
  email?: string;
}

export interface IPersonModel extends IPerson, Document {}

const PersonSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String },
    contact: { type: String, required: true },
    nationalId: { type: String },
    email: { type: String },
  },
  { versionKey: false }
);

export default mongoose.model<IPersonModel>("Person", PersonSchema);
