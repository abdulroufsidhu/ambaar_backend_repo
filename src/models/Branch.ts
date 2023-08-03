import mongoose, { Document, Schema } from "mongoose";
import { IBusiness } from "./Business";

export interface IBranch {
  name: string;
  contact: string;
  email: string;
  location: string;
  business: IBusiness;
}

interface IBranchModel extends IBranch, Document {}

const BranchSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },
    business: { type: mongoose.Types.ObjectId, ref: "Business" },
  },
  { versionKey: false }
);

export default mongoose.model<IBranchModel>("Branch", BranchSchema);
