// Path: src/services/getProfilePictureService.ts

import { Request } from "express";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const TOKEN = process.env.TELEGRAMBOTTOKEN!;
const profilePhotoDir = path.resolve(__dirname, '../../pfps');

// Ensure the profile photos directory exists
if (!fs.existsSync(profilePhotoDir)) {
    fs.mkdirSync(profilePhotoDir, { recursive: true });
}

/**
 * Downloads the profile photo from Telegram and saves it locally if it doesn't already exist.
 * @param {string} filePath - The file path on Telegram's server.
 * @param {string} userId - The user ID to associate the photo with.
 * @returns {Promise<void>} - A promise that resolves when the download is complete.
 */
const downloadProfilePhoto = async (filePath: string, userId: string): Promise<void> => {
    const localFilePath = path.join(profilePhotoDir, `${userId}.jpg`);

    // For exit if the file already exists
    if (fs.existsSync(localFilePath)) {
        return;
    }

    const url = `https://api.telegram.org/file/bot${TOKEN}/${filePath}`;
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(localFilePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

/**
 * Gets the file path from Telegram for a given file ID.
 * @param {string} fileId - The file ID on Telegram's server.
 * @returns {Promise<string>} - A promise that resolves with the file path.
 */
const getTelegramFilePath = async (fileId: string): Promise<string> => {
    const response = await axios.get(`https://api.telegram.org/bot${TOKEN}/getFile`, {
        params: { file_id: fileId },
    });

    return response.data.result.file_path;
};

/**
 * Retrieve the profile photo URL of specific user from Telegram.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export const getUserProfilePhoto = async (tgid: string, req: Request): Promise<string>=> {

    const photoResponse = await axios.get(`https://api.telegram.org/bot${TOKEN}/getUserProfilePhotos`, {
        params: {
            user_id: tgid,
            limit: 1
        }
    });

    const pictures = photoResponse.data.result.photos;

    if (pictures.length > 0) {
        const fileId = pictures[0][0].file_id;
        const filePath = await getTelegramFilePath(fileId);
        await downloadProfilePhoto(filePath, tgid);

        // Generate the URL to access the profile photo
        return `${req.protocol}://${req.get('host')}/pfps/${tgid}.jpg`;

    } else {
        return `${req.protocol}://${req.get('host')}/pfps/default.jpg`;
    }

};
