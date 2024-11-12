// Path: src/controllers/giftController.ts

import { Request, Response } from "express";
import * as giftServices from "../services/giftService";

// Retrieves all gifts available in the system.
export const getAllGifts = async (req: Request, res: Response) => {
    try {
        const gifts = await giftServices.getAllGifts();
        res.status(200).json(gifts);
    } catch (error) {
        console.error("Error fetching all gifts:", error);
        res.status(500).json({ message: "An error occurred while fetching gifts." });
    }
};

// Retrieves gifts available to be sent by a specific user.
export const getGiftsAvailableToBeSend = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    try {
        const availableGifts = await giftServices.getGiftsAvailableToBeSend(userId);
        res.status(200).json(availableGifts);
    } catch (error) {
        console.error("Error fetching available gifts to send:", error);
        res.status(500).json({ message: "An error occurred while fetching available gifts." });
    }
};

// Retrieves all gifts received by a specific user.
export const getGiftsReceivedByUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    try {
        const receivedGifts = await giftServices.getGiftsReceivedByUser(userId);
        res.status(200).json(receivedGifts);
    } catch (error) {
        console.error("Error fetching gifts received by user:", error);
        res.status(500).json({ message: "An error occurred while fetching received gifts." });
    }
};

// Retrieves the most recent transactions associated with a particular gift.
export const getGiftRecentTransaction = async (req: Request, res: Response) => {
    const { giftId } = req.body;

    try {
        const recentTransactions = await giftServices.getRecentTransaction(giftId);
        res.status(200).json(recentTransactions);
    } catch (error) {
        console.error("Error fetching recent transactions for gift:", error);
        res.status(500).json({ message: "An error occurred while fetching recent transactions." });
    }
};

// Creates a purchase transaction and generates a payment invoice for a specified gift.
export const purchaseGift = async (req: Request, res: Response) => {
    const { userId, giftId } = req.body;

    try {
        const invoiceUrl = await giftServices.purchase(userId, giftId);
        res.status(201).json({ invoiceUrl });
    } catch (error) {
        console.error("Error purchasing gift:", error);
        res.status(500).json({ message: "An error occurred during the purchase." });
    }
};

// Retrieves a gift that was purchased successfully.
export const purchaseSuccess = async (req: Request, res: Response) => {
    const { successId } = req.params;

    try {
        const transaction = await giftServices.getPurchaseSuccess(successId);
        res.status(200).json(transaction);
    } catch (error) {
        console.error("Error fetching successful purchase:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Processes the reception of a gift by a recipient using a temporary link ID.
export const receiveGift = async (req: Request, res: Response) => {
    const { receiverId, purchaseReferenceId } = req.body;

    try {
        const transaction = await giftServices.receive(receiverId, purchaseReferenceId);
        res.status(200).json(transaction);
    } catch (error) {
        console.error("Error receiving gift:", error);
        res.status(500).json({ message: "An error occurred while receiving the gift." });
    }
};
