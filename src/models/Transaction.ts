// Path: src/models/Transaction.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
    type: string;
    from: string;
    to?: string;
    giftId: mongoose.Schema.Types.ObjectId;
    purchaseReferenceId?: mongoose.Schema.Types.ObjectId;
    status?: string;
    temporaryLinkId?: string;
    invoiceId?: number;
    successId?: string;
}

const transactionSchema: Schema<ITransaction> = new Schema({
    type: { type: String, enum: ["purchase", "send"], required: true },
    from: { type: String, ref: "User", required: true },
    to: { type: String, ref: "User" },
    giftId: { type: mongoose.Schema.Types.ObjectId, ref: "Gift", required: true },
    purchaseReferenceId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    status: { type: String, enum: ["pending", "success", "failed"], default: "success" },
    temporaryLinkId: { type: String },
    invoiceId: { type: Number },
    successId: { type: String }
}, { 
    timestamps: true 
});

transactionSchema.index({ from: 1 });
transactionSchema.index({ to: 1 });
transactionSchema.index({ temporaryLinkId: 1 }, { unique: true, sparse: true });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
export default Transaction;