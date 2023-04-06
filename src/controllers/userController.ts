import userSchema from "../models/userSchema";
import { Types } from "mongoose";
import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email } = req.body;
        if (!email) {
            const user = await userSchema.create(req.body);
            res.status(201).json({ user });
        }
        return res.status(400).json({ error: "User with this email already exists" });

    } catch (error) {
        return res.status(500).json({ error });
    }
}

export const getUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid user id" });
        }
        const user = await userSchema.findById(id);
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}