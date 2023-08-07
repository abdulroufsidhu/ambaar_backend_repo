import mongoose, { Document, Schema } from "mongoose";
import { IBusiness } from "./business";
import mongooseUniqueValidator from "mongoose-unique-validator";

export interface IBranch {
  name: string;
  contact: string;
  email: string;
  location: string;
  business: IBusiness;
}

interface IBranchModel extends IBranch, Document { }

const BranchSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    location: { type: String, required: true, trim: true },
    business: { type: mongoose.Types.ObjectId, ref: "Business" },
  },
  { versionKey: false }
);

BranchSchema.plugin(mongooseUniqueValidator)

export default mongoose.model<IBranchModel>("Branch", BranchSchema);
