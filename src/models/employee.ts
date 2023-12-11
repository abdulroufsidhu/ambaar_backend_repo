import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";
import { IBranch } from "./branch";
import { IPermission } from "./permission";

export interface IEmployee {
  user: IUser;
  branch: IBranch;
  role: string;
  permissions: Array<IPermission>;
  status: string;
}

interface IEmployeeModel extends IEmployee, Document {}

const EmployeeSchema: Schema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    branch: { type: mongoose.Types.ObjectId, required: true, ref: "Branch" },
    role: { type: String, required: true },
    permissions: {
      type: [mongoose.Types.ObjectId],
      ref: "Permission",
    },
    status: { type: String, required: true, enum: ["active", "inactive"] }
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IEmployeeModel>("Employee", EmployeeSchema);
