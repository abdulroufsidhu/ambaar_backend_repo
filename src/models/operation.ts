import mongoose, { Schema, Document } from "mongoose";
import { IBranch, IInventory, IPerson } from "./";
import { IEmployee } from "./employee";
import { IInventoryModel } from "./inventory";

export interface IOperation {
  inventory: IInventoryModel;
  employee: IEmployee;
	person: IPerson;
  action: "sale" | "purchase";
  quantity: number;
  price: number;
}

export interface IOperationModel extends IOperation, Document {}

const OperationySchema: Schema = new Schema(
  {
    inventory: { type: mongoose.Types.ObjectId, ref: "Inventory" },
    employee: { type: mongoose.Types.ObjectId, ref: "Employee" },
    person: { type: mongoose.Types.ObjectId, ref: "Person" },
    action: { type: String, required: true, enum: ["sale","purchase"] },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IOperationModel>("Operation", OperationySchema);
