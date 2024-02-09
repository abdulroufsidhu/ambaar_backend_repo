import mongoose, { Document, Schema } from "mongoose";

export interface IProduct {
  name: string;
  detail: string;
  colour: string;
  variant: string;
}

interface IProductModel extends IProduct, Document {}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    detail: { type: String },
    colour: { type: String },
    variant: { type: String },
  },
  { versionKey: false, timestamps: true }
);

ProductSchema.index({
  name: "text",
  detail: "text",
  colour: "text",
  variant: "text",
});

export default mongoose.model<IProductModel>("Product", ProductSchema);
