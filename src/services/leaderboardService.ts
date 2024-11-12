// Path: src/services/leaderboardService.ts

import Transaction from "../models/Transaction";
import User from "../models/User";

/**
 * Fetches the top 100 users who received the most gifts, including their rank and profile details.
 * @returns A list of top users with their gift count, rank, and user details.
 * @async
 * @function
 * @name getTopUsersByGiftsReceived
 * @throws {Error} Throws error if there is an issue fetching the top users.
 */
export const getTopUsersByGiftsReceived = async () => {
    try {

        const topUsers = await Transaction.aggregate([
            { $match: { type: "send", status: "success" } },
            { $group: { _id: "$to", receivedCount: { $sum: 1 } } },
            { $sort: { receivedCount: -1 } },
            { $limit: 100 } // Get the top 100 users
        ]);

        const userIds = topUsers.map(user => user._id);
        const users = await User.find({ _id: { $in: userIds } });

        const topUsersWithDetails = topUsers.map((user, index) => {
            const userDetails = users.find(u => u._id.toString() === user._id.toString());
            return {
                ...userDetails?.toObject(),
                receivedCount: user.receivedCount,
                rank: index + 1
            };
        });

        return topUsersWithDetails;

    } catch (error) {
        console.error("Error fetching top users by gifts received:", error);
        throw error;
    }
};
