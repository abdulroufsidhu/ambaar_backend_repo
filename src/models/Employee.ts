import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { IBranch } from "./Branch";
import { IPermission } from "./Permission";

export interface IEmployee {
  user: IUser;
  brach: IBranch;
  role: string;
  permissions: Array<IPermission>;
}

interface IEmployeeModel extends IEmployee, Document {}

const EmployeeSchema: Schema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, require: true, ref: "User" },
    branch: { type: mongoose.Types.ObjectId, require: true, ref: "Branch" },
    role: { type: String, require: true },
    prmissions: {
      type: mongoose.Types.Array<mongoose.Types.ObjectId>,
      require: true,
      ref: "Permission",
    },
  },
  { versionKey: false }
);

export default mongoose.model<IEmployeeModel>("Employee", EmployeeSchema);
