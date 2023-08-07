import mongoose, { Document, Schema } from "mongoose";
import { IPerson } from "./Person";
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
    name: { type: String, required: true },
    contact: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    licence: { type: String },
    founder: { type: mongoose.Types.ObjectId, ref: "Person" },
  },
  { versionKey: false }
);

BusinessSchema.plugin(mongooseUniqueValidator);

export default mongoose.model<IBusinessModel>("Business", BusinessSchema);
