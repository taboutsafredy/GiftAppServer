// Path: src/services/userService.ts

import User, { IUser } from "../models/User";
import Transaction from "../models/Transaction";

/**
 * Creates a new user in the database.
 * @param newUser - The user data to create.
 * @returns The created user.
 */
export const createUser = async (newUser: IUser) => {
    const user = new User(newUser);
    return await user.save();
};

/**
 * Retrieves a user by their ID.
 * @param _id - The ID of the user.
 * @returns The user corresponding to the ID.
 */
export const getUser = async (_id: string) => {
    return await User.findById(_id);
};

/**
 * Calculates a user's rank based on the number of gifts received compared to other users.
 * @param _id - The ID of the user.
 * @returns The rank of the user based on gifts received.
 */
export const getRank = async (_id: string) => {

    const userReceivedCount = await Transaction.countDocuments({
        to: _id,
        status: "success"
    });

    // Count the number of users who have received more gifts than this user
    const rank = await Transaction.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: "$to", receivedCount: { $sum: 1 } } },
        { $match: { receivedCount: { $gt: userReceivedCount } } },
        { $count: "higherRankUsers" }
    ]);

    const higherRankUsers: number = rank[0]?.higherRankUsers || 0;
    return higherRankUsers + 1; // Add 1 to include the current user
};

/**
 * Retrieves the 20 most recent transactions involving the user.
 * This includes purchases, sending, and receiving of gifts.
 * @param _id - The ID of the user.
 * @returns The 20 most recent transactions of the user.
 */
export const recentActions = async (_id: string) => {
    return await Transaction.find({
        $or: [
            { from: _id },
            { to: _id }
        ]
    })
    .populate("giftId")
    .sort({ createdAt: -1 })
    .limit(20); 
};
