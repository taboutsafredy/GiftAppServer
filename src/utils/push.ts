// Path: src/utils/push.ts

import mongoose from "mongoose";
import Gift from "../models/Gift";
import dotenv from "dotenv";
dotenv.config();

const connect = process.env.MONGODB;

if (!connect) {
    throw new Error("MONGODB environment variable is not defined");
}

const gifts = [
    {
        "name": "Delicious Cake",
        "price": 10,
        "asset": "USDT",
        "totalInStock": 500,
        "quantityPurchased": 0
    },
    {
        "name": "Green Star",
        "price": 5,
        "asset": "TON",
        "totalInStock": 3000,
        "quantityPurchased": 0
    },
    {
        "name": "Blue Star",
        "price": 0.01,
        "asset": "ETH",
        "totalInStock": 5000,
        "quantityPurchased": 0
    },
    {
        "name": "Red Star",
        "price": 7,
        "asset": "USDT",
        "totalInStock": 10000,
        "quantityPurchased": 0
    }
];

/**
 * Pushes the gifts into the database.
 * @returns {Promise<void>}
 * @async
 * @function
 * @name pushintodb
 */
const pushintodb = async () => {
    console.log("push into database...");
    try {
        await mongoose.connect(connect as string);

        await Gift.deleteMany({});
        await Gift.insertMany(gifts);

        console.log("pushed well!");
        mongoose.connection.close();
    } catch (error) {
        console.error("It's bad :", error);
        mongoose.connection.close();
    }
};

pushintodb();