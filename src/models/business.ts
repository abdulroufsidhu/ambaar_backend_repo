import mongoose, { Document, Schema } from "mongoose";
import { IPerson } from "./person";
import mongooseUniqueValidator from "mongoose-unique-validator";

export interface IBusiness {
  name: string;
  contact: string;
  email: string;
  licence: string;
  founder: IPerson;
}

interface IBusinessModel extends IBusiness, Document { }

const BusinessSchema: Schema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    contact: { type: String, trim: true, required: true, unique: true },
    email: { type: String, trim: true, required: true, unique: true },
    licence: { type: String },
    founder: { type: mongoose.Types.ObjectId, trim: true, ref: "Person" },
  },
  { versionKey: false }
);

BusinessSchema.plugin(mongooseUniqueValidator);

export default mongoose.model<IBusinessModel>("Business", BusinessSchema);
