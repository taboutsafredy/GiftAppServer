// Path: src/services/giftServices.ts

import { v4 as uuidv4 } from "uuid";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import Gift from "../models/Gift";
import Transaction from "../models/Transaction";
import NotificationService from "./notificationService";
import dotenv from "dotenv";
import axios from "axios";
import User from "../models/User";
dotenv.config();

/**
 * Retrieves all gifts available in the system.
 * @returns A list of all gift documents.
 */
export const getAllGifts = async () => {
    return await Gift.find();
};

/**
 * Retrieves gifts available to be sent by a specific user.
 * A gift is considered available if it has being purchased and not already sent.
 * @param _id - The ID of the user requesting available gifts.
 * @returns A list of gifts available to be sent by the user.
 */
export const getGiftsAvailableToBeSend = async (_id: string) => {
    // gifts purchased by this user
    const purchasedGifts = await Transaction.find({
        from: _id,
        type: "purchase",
        status: "success"
    }).populate("giftId");

    // gifts sent by this user
    const sentGifts = await Transaction.find({
        from: _id,
        type: "send",
        status: "success"
    });

    const sentReferenceIds = new Set(sentGifts.map(send => send.purchaseReferenceId));

    return purchasedGifts.filter(purchase => !sentReferenceIds.has(purchase.id));
};

/**
 * Retrieves all gifts received by a specific user.
 * Searches for successful transactions where the user is the recipient.
 * @param _id - The ID of the user to retrieve received gifts for.
 * @returns A list of gifts the user has received.
 */
export const getGiftsReceivedByUser = async (_id: string) => {
    try {
        
        return await Transaction.find({
            to: _id,
            type: "send",
            status: "success"
        })
        .populate("from")
        .populate("to")
        .populate("giftId")
        .sort({ createdAt: -1 });

    } catch (error) {
        console.error("Error fetching gifts received by user:", error);
        throw error;
    }
};

/**
 * Retrieves the most recent transactions associated with a particular gift.
 * @param giftId - The ID of the gift to retrieve transactions for.
 * @returns A list of the most recent transactions related to the specified gift.
 */
export const getRecentTransaction = async (giftId: mongoose.Schema.Types.ObjectId) => {
    return await Transaction.find({
        giftId: giftId,
        status: "success"
    })
    .populate("from")
    .populate("to")
    .sort({ createdAt: -1 })
    .limit(10); // Retrieve the 10 most recent transactions
};


/**
 * Creates a purchase transaction and generates a payment invoice for a specified gift.
 * @param _id - The ID of the user initiating the purchase.
 * @param giftId - The ID of the gift being purchased.
 * @returns A promise that resolves to the URL of the mini-app invoice.
 * @throws Error if the gift is not found or if there's an issue creating the invoice.
 */
export const purchase = async (_id: string, giftId: mongoose.Schema.Types.ObjectId) => {
    try {
        const giftToPurchase = await Gift.findById(giftId);
        if (!giftToPurchase) {
            throw new Error("Gift not found :(");
        }

        if (giftToPurchase.quantityPurchased >= giftToPurchase.totalInStock) {
            throw new Error("Not enough gifts in stockm sorry :(");
        }

        const createInvoiceAPIUrl = "https://pay.crypt.bot/api/createInvoice";
        const cryptoPayAPIToken = process.env.CRYPTOPAYTOKEN;
        const transactionSuccessId = uuidv4();
        const transactionSuccessUrl = `https://app.giftcontestbot.tech/gifts/success/purch__${transactionSuccessId}`;

        const dataToMakeInvoice = {
            amount: giftToPurchase.price,
            asset: giftToPurchase.asset, 
            description: `Purchasing a ${giftToPurchase.name} gift`,
            payload: _id,
            paid_btn_name: "callback",
            paid_btn_url: `${transactionSuccessUrl}`,
            allow_anonymous: false,
        };

        const getInvoice = await axios.post(createInvoiceAPIUrl, dataToMakeInvoice, {
            headers: {
                "Crypto-Pay-API-Token": cryptoPayAPIToken,
            },
        });

        const transaction = new Transaction({
            type: "purchase",
            from: _id, 
            giftId: giftId,
            status: "pending",
            invoiceId: getInvoice.data.result.invoice_id,
            successId: transactionSuccessId,
        });

        await transaction.save();

        return getInvoice.data.result.mini_app_invoice_url;
    } catch (error: any) {

        console.error("Purchase error:", error.message);
        throw new Error("An error occurred during the purchase. Please try again later.");
    }
};

/**
 * Retrieves the details of a successful gift purchase.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The gift details.
*/
export const getPurchaseSuccess = async (successId: string) => { 
    try {
        const transaction = await Transaction.findOne(
            { 
                successId: successId, 
                status: "success" 
            }).populate("from")
            .populate("giftId");

        if (!transaction) {
            throw new Error("Transaction not found or not completed");
        }

        return transaction;

    } catch (error: any) {
        console.error("Error fetching purchase success:", error.message);
        throw new Error("An error occurred while fetching the gift details.");
    }
}


/**
 * Processes the reception of a gift by a recipient using a temporary link ID to verify and claim the gift.
 * @param receiverId - The ID of the user receiving the gift.
 * @param temporaryLinkId - The unique temporary link ID for the transaction, used to identify the gift to be claimed.
 * @returns A promise that resolves to the updated transaction object with status set to "success" upon successful claim.
 * @throws Error if the transaction does not exist, is already claimed, or if the receiver tries to claim their own gift.
 */
export const receive = async (receiverId: string, purchaseReferenceId: string) => {
    try {
        const transaction = await Transaction.findOne({
            purchaseReferenceId: purchaseReferenceId,
            status: "pending"
        });

        if (!transaction) {
            throw new Error("The transaction does not exist or has already been processed.");
        }

        if (transaction.to) {
            throw new Error("The gift has already been received.");
        }

        if (transaction.from === receiverId) {
            throw new Error("Nope, you cannot receive a gift from yourself.");
        }

        transaction.to = receiverId;
        transaction.status = "success";
        await transaction.save();

        await transaction.populate(['from', 'giftId']);

        const sender = await User.findById(transaction.from);
        const receiver = await User.findById(receiverId);
        const gift = await Gift.findById(transaction.giftId);

        await NotificationService.notifySend(
            transaction.from,
            receiverId,
            `${sender?.firstname} ${sender?.lastname ? sender?.lastname : ""}`,
            `${receiver?.firstname} ${receiver?.lastname ? receiver?.lastname : ""}`,
            gift?.name!,
        );

        return transaction;

    } catch (error: any) {
        console.error("Receive error:", error.message);
        throw new Error("An error occurred while receiving the gift.");
    }
};
