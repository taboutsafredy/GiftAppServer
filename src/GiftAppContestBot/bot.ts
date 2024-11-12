// Path: GiftAppContestBot/bot.ts

import dotenv from "dotenv";
import { randomBytes } from "crypto";
import { Bot, Context, InlineKeyboard } from "grammy";
import Transaction from "../models/Transaction";
import { IGift } from "../models/Gift";
import { InlineQueryResultArticle } from "grammy/types";
dotenv.config();

const bot = new Bot<Context>(process.env.TELEGRAMBOTTOKEN!);

const openGiftAppInlineKeyboard = new InlineKeyboard().webApp("Open App", "https://sonner.emilkowal.ski/getting-started#render-a-toast");

bot.command("start", async (ctx) => {
    try {
        await ctx.replyWithPhoto("https://imgur.com/NH7JQV5", {
            caption: "🎁 Here you can buy and send gifts to your friends.",
            reply_markup: openGiftAppInlineKeyboard,
        });
    } catch (error) {
        console.error("Error sending start message :|", error);
        throw new Error("Error sending start message :|");
    }
});

// to anwser with a gift 🎁
bot.on("inline_query", async (ctx) => {
    const getQuery = ctx.inlineQuery.query;
    const receiveGiftInlineKeyboard = new InlineKeyboard().webApp("Receive Gift", `https://sonner.emilkowal.ski/${getQuery}`);

    const transaction = await Transaction.findOne({
        _id: getQuery,
        from: ctx.from?.id.toString(),
        status: "success",
    }).populate<{ giftId: IGift }>("giftId");

    if (!transaction) {
        return;
    }

    const gift = transaction.giftId as IGift;

    const results: InlineQueryResultArticle[] = [{
        type: "article",
        id: gift._id!.toString(),
        title: "Send Gift",
        description: `Send a gift of ${gift.name}.`,
        input_message_content: {
            message_text: "🎁 I have a <b>gift</b> for you! Tap the button below to open it.",
            parse_mode: "HTML",
        },
        reply_markup: receiveGiftInlineKeyboard,
        thumbnail_url: "https://imgur.com/wn9y2Vn",
    }];

    await ctx.answerInlineQuery(results, { is_personal: true });
});

// make sure that the user has sent the gift before making the transaction
bot.on("chosen_inline_result", async (ctx) => {
    const choosenResult = ctx.chosenInlineResult;
    if (!choosenResult) {
        return;
    }

    try {

        const transaction = new Transaction({
            type: "send",
            from: choosenResult.from.id.toString(),
            giftId: choosenResult.result_id,
            purchaseReferenceId: choosenResult.query,
            status: "pending",
        });

        await transaction.save();

    } catch (error) {
        console.error("Error creating send transaction :|", error);
    }
});

bot.start();