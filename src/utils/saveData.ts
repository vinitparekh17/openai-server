import { Response } from "express";
import userSchema from "../models/userSchema";
import messageSchema from "../models/messageSchema";
import { sendJsonResponse } from "./responseHandler";

export async function saveData(model: string, res: Response, data: any) {
    try {
        switch (model) {
            case 'user':
                let existUser = await userSchema.findOne({ email: data.email })
                if(existUser) return sendJsonResponse(res, false, null, 409, "User already exist!")
                let newUser = await userSchema.create(data)
                return sendJsonResponse(res, true, newUser, 201)
            case 'chat':
                let newChats = await messageSchema.create(data)
                if(!newChats) return sendJsonResponse(res, false, null, 500, "Internal server issue while message saving!")
            default:
                console.log(`Invalid schema ${model}`);
                break;
        }
    } catch (error) {
        return sendJsonResponse(res, false, null, 500, "Internal server error!")
    }
}