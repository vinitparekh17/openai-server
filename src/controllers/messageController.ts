import messageSchema from "../models/messageSchema";
import { Request, Response } from "express";
import { openai } from "../app";
import { sendJsonResponse } from "../utils/responseHandler";

export const generateResponse = async (req: Request, res: Response): Promise<Response> => {
    try {
        let { promt } = req.body
        let { id } = req.params
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: 100,
            temperature: 0.7,
            messages: promt,
            n: 1,
            user: id
        })
        console.log(completion);
        sendJsonResponse(res, true, completion);
        if (!completion) {
            return sendJsonResponse(res, false, null, 400, "Unable to generate response!")
        }
        let message = completion.data.choices[0].message.content
        return sendJsonResponse(res, true, message, 200)
    } catch (error) {
        console.log(error);
        return sendJsonResponse(res, false, null, 500, "Internal server error!")
    }
}