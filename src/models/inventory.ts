import mongoose, { Schema, Document } from "mongoose";
import { IBranch, IProduct } from "./";

export interface IInventory {
  product: IProduct;
  branch: IBranch;
}

interface IInventoryModel extends IInventory, Document { }

const InventorySchema: Schema = new Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product" },
  branch: { type: mongoose.Types.ObjectId, ref: "Branch" },
}, { versionKey: false, timestamps: true, },);

export default mongoose.model<IInventoryModel>("Inventory", InventorySchema);




