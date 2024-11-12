// Path: src/controllers/webhookController.ts

import { Request, Response } from "express";
import { checkSignature } from "../utils/checkSignature";
import webhookService from "../services/webhookService";
import dotenv from "dotenv";
dotenv.config();

// Handles incoming webhooks from the Cryptopay API.
export const handleWebhook = async (req: Request, res: Response) => {

    const receivedToken = req.params.token;

    const isVerified = checkSignature(process.env.CRYPTOPAYTOKEN!, {
        body: req.body,
        headers: req.headers,
    });

    if (!isVerified || receivedToken !== process.env.WEBHOOKTOKEN) {
        res.status(403).json({ error: "Unauthorized request" });
        return;
    }

    const { update_type, payload } = req.body;

    try {
        
        await webhookService.processWebhookEvent(update_type, payload);
        res.status(200).json({ message: "Webhook received successfully" });
    } catch (error: any) {
        console.error("Error processing webhook:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};