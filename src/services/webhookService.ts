// Path: src/services/webhookService.ts

import Gift from "../models/Gift";
import Transaction from "../models/Transaction";
import NotificationService from "./notificationService";


/**
 * Processes a webhook event from the Cryptopay API and updates the transaction status.
 * @param update_type - The type of update received.
 * @param payload - The payload of the webhook event.
 */ 
const processWebhookEvent = async ( update_type: string, payload: any): Promise<void> => {

    if (update_type === "invoice_paid") {
        const transactionId: number = payload.invoice_id;

         const transaction = await Transaction.findByIdAndUpdate(
            { invoiceId: transactionId },
            { status: "success" },
            { new: true }
        );

        if (transaction) {
            const gift = await Gift.findByIdAndUpdate(transaction.giftId);
            if (gift) {
                gift.quantityPurchased += 1;
                await gift.save();
                await NotificationService.notifyPurchase(transaction.from, gift.name);
            }
        }
    }
};

export default { processWebhookEvent };