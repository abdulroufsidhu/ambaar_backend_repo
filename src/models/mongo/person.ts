import mongoose, { Document, Schema } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

export interface IPerson {
  name: string;
  username?: string;
  contact: string;
  nationalId?: string;
  email?: string;
}

interface IPersonModel extends IPerson, Document {}

const PersonSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, trim: true, unique: true },
    contact: { type: String, required: true, trim: true, unique: true },
    nationalId: { type: String, trim: true, unique: true },
    email: { type: String, unique: true, trim: true, index: true },
  },
  { versionKey: false, timestamps: true }
);

PersonSchema.plugin(mongooseUniqueValidator);

export default mongoose.model<IPersonModel>("Person", PersonSchema);
