import mongoose, { Document, Schema } from "mongoose";

export interface IProduct {
  name: string;
  detail: string;
  colour: string;
  variant: string;
  serialNumber: string;
  unitBuyPrice: number;
  unitSellPrice: number;
  unitDescountPrice: number;
  quantity: number;
}

interface IProductModel extends IProduct, Document { }

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    detail: { type: String },
    colour: { type: String },
    variant: { type: String },
    serialNumber: { type: String, required: true },
    unitBuyPrice: { type: Number, required: true },
    unitSellPrice: { type: Number, required: true },
    unitDescountPrice: { type: Number },
    quantity: { type: Number, required: true },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IProductModel>("Product", ProductSchema);
