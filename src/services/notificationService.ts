// Path: src/services/notificationService.ts

import { Api } from "grammy";
import dotenv from "dotenv";
dotenv.config();

const api = new Api(process.env.TELEGRAMBOTTOKEN!);

/**
 * Service for sending notification messages to users on Telegram, primarily for purchase and gift-sending events.
 */
class NotificationService {

    /**
     * Notifies a user of a successful gift purchase.
     * @param purchaserId - The Telegram ID of the user who made the purchase.
     * @param giftName - The name of the purchased gift to display in the notification.
     * @returns A promise that resolves when the notification message is sent.
     */
    static async notifyPurchase(purchaserId: string, giftName: string) {
        const message = `✅ You have purchased the gift of <b>${giftName}</b>.`;
        const button = [{ text: "Open Gifts", web_app: { url: "https://app.giftcontestbot.tech/gifts" } }]; // Button can link to gifts page
        await this.sendTelegramMessage(purchaserId, message, button);
    }
    
    /**
     * Sends a notification to both the sender and the receiver of a gift.
     * @param senderId - The Telegram ID of the user sending the gift.
     * @param receiverId - The Telegram ID of the user receiving the gift.
     * @param senderName - The name of the sender, displayed in the receiver's message.
     * @param receiverName - The name of the receiver, displayed in the sender's message.
     * @param giftName - The name of the gift, displayed in both notifications.
     * @returns A promise that resolves when both messages are sent successfully.
     */
    static async notifySend( senderId: string, receiverId: string, senderName: string, receiverName: string, giftName: string ) {
        const senderMessage = `👌 <b>${receiverName}</b> received your gift of <b>${giftName}</b>.`;
        const senderButton = [{ text: "Open App", web_app: { url: "https://app.giftcontestbot.tech" } }];
        await this.sendTelegramMessage(senderId, senderMessage, senderButton);

        const receiverMessage = `⚡️ <b>${senderName}</b> has given you the gift of <b>${giftName}</b>.`;
        const receiverButton = [{ text: "View Gift", web_app: { url: "https://app.giftcontestbot.tech/profile" } }];
        await this.sendTelegramMessage(receiverId, receiverMessage, receiverButton);
    }

    /**
     * Sends a custom message to a specified Telegram user with an inline keyboard button.
     * @param userId - The Telegram ID of the recipient.
     * @param text - The message content to send, formatted as HTML.
     * @param button - An array of button objects containing text and a web app URL.
     * @returns A promise that resolves when the message is sent successfully.
     * @throws Logs an error message if the message fails to send.
     */
    static async sendTelegramMessage( userId: string, text: string, button: Array<{ text: string, web_app: { url: string } }>) {
        try {
            await api.sendMessage(userId, text, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [button]
                }
            });
        } catch (error) {
            console.error("Error sending Telegram message :|", error);
        }
    }
}

export default NotificationService;
