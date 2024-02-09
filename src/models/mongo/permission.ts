import mongoose, { Schema, Document } from "mongoose";

export interface IPermission {
  name: string;
}

interface IPermissionModel extends IPermission, Document {}

const PermissionSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { versionKey: false }
);

export default mongoose.model<IPermissionModel>("Permission", PermissionSchema);
