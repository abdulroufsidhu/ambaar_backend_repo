import mongoose, { Schema, Document } from "mongoose";
import { IBranch, IProduct } from "./";

export interface IInventory {
  product: IProduct;
  branch: IBranch;
  serialNumber: string;
  unitBuyPrice: number;
  unitSellPrice: number;
  unitDescountPrice: number;
  quantity: number;
}

export interface IInventoryModel extends IInventory, Document {}

const InventorySchema: Schema = new Schema(
  {
    product: { type: mongoose.Types.ObjectId, ref: "Product" },
    branch: { type: mongoose.Types.ObjectId, ref: "Branch" },
    serialNumber: { type: String, required: true },
    unitBuyPrice: { type: Number, required: true },
    unitSellPrice: { type: Number, required: true },
    unitDescountPrice: { type: Number },
    quantity: { type: Number, required: true },
  },
  { versionKey: false, timestamps: true },
);

InventorySchema.index({product: "text", branch: "text"})

export default mongoose.model<IInventoryModel>("Inventory", InventorySchema);
