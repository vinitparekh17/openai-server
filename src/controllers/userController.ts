import userSchema from "../models/userSchema";
import { Request, Response } from "express";
import { openai } from "../app";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            const user = await userSchema.create(req.body);
            res.status(201).json({ user });
        }
        return res.status(400).json({ error: "User with this email already exists" });

    } catch (error) {
        res.status(500).json({ error });
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await userSchema.findById(req.params.id);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error });
    }
}