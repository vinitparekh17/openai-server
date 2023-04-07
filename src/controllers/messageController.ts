import { NextFunction, Request, Response } from "express";
import { openai } from "../app";
import { sendJsonResponse } from "../utils/responseHandler";
import { saveData } from "../utils/saveData";
import DataProvider from "../utils/DataProvider";
import messageSchema from "../models/messageSchema";

let MyDataProvider = new DataProvider(messageSchema);
export const generateResponse = async (req: Request, res: Response): Promise<Response> => {
    try {
        let { prompt } = req.body
        let { id } = req.params
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: 200,
            temperature: 0.7,
            messages: [{"role": "user", "content": prompt}],
            n: 1,
            user: id
        })
        if (!completion) {
            return sendJsonResponse(res, false, null, 400, "Unable to generate response!")
        }
        let answer = completion.data.choices[0].message.content
        sendJsonResponse(res, true, answer, 200)
        saveData('chat', res, {
            prompt,
            answer,
            user: id
        })
    } catch (error) {
        console.log(error);
        return sendJsonResponse(res, false, null, 500, "Internal server error!")
    }
}

export async function getConversation(req: Request, res: Response, next: NextFunction ) {
    try {
        const data = MyDataProvider.getData();
        if(!data) return sendJsonResponse(res, false, null, 404, "Data not found!")
        return sendJsonResponse(res, true, data, 200)
    } catch (error) {
        return sendJsonResponse(res, false, null, 500, "Internal server error!")
    }
}