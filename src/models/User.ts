// Path: src/models/User.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    _id: string;
    username?: string;
    firstname: string;
    lastname?: string;
    profilePicture?: string;
}

const userSchema: Schema<IUser> = new Schema({
    _id: { type: String, required: true },
    username: { type: String },
    firstname: { type: String, required: true },
    lastname: { type: String },
    profilePicture: { type: String }
}, { 
    timestamps: true 
});


const User = mongoose.model<IUser>("User", userSchema);
export default User;
