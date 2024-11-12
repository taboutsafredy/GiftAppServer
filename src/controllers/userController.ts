// Path: src/controllers/userController.ts

import { Response, Request } from "express";
import * as userService from "../services/userService";
import { getUserProfilePhoto } from "../services/getProfilePictureService";

// Creates new user in the database.
export const createUser = async (req: Request, res: Response) => {
    const newUser = {
        ...req.body,
        profilePicture: await getUserProfilePhoto(req.body._id, req)
    };
    try {
        const user = await userService.createUser(newUser);
        res.status(201).json(user);
    } catch (error: any) {
        console.error("Error creating user:", error.message);
        return res.status(500).json({ error: "An error occurred while creating the user." });
    }

};

// Retrieves a user by their ID.
export const getUser = async (req: Request, res: Response) => {

    const _id = req.params.id;
    try {
        const user = await userService.getUser(_id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json(user);
    } catch (error: any) {
        console.error("Error getting user:", error.message);
        return res.status(500).json({ error: "An error occurred while getting the user." });
    }
};

// Retrieves the rank of a user based on the number of gifts received compared to other users.
export const getRank = async (req: Request, res: Response) => {

    const _id = req.params.id;
    try {
        const rank = await userService.getRank(_id);
        res.json({ rank });
    } catch (error: any) {
        console.error("Error getting rank:", error.message);
        return res.status(500).json({ error: "An error occurred while getting the rank." });
    }

};


// Retrieves the 20 most recent transactions involving the user.
export const getRecentActions = async (req: Request, res: Response) => {

    const _id = req.params.id;
    try {
        const transactions = await userService.recentActions(_id);
        res.json(transactions);
    } catch (error: any) {
        console.error("Error getting recent actions:", error.message);
        return res.status(500).json({ error: "An error occurred while getting the recent actions." });
    }
};

