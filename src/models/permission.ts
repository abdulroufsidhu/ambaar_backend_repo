import mongoose, { Schema, Document } from "mongoose";

export interface IPermission {
  name: string;
  allowed: boolean;
}

interface IPermissionModel extends IPermission, Document { }

const PermissionSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    allowed: { type: Boolean, required: true },
  },
  { versionKey: false }
);

export default mongoose.model<IPermissionModel>("Permission", PermissionSchema);
