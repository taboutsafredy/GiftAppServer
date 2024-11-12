// Path: src/models/Gift.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IGift extends Document {
    name: string;
    price: number;
    asset: string;
    totalInStock: number;
    quantityPurchased: number;
}

const giftSchema: Schema<IGift> = new Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    asset: { type: String, required: true },
    totalInStock: { type: Number, required: true },
    quantityPurchased: { type: Number, default: 0 }
});

giftSchema.index({ name: 1 });

const Gift = mongoose.model<IGift>("Gift", giftSchema);
export default Gift;
