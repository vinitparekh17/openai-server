import { NextFunction, Request, Response } from "express";
import { openai } from "../lib/Openai";
import DataProvider from "../utils/Dataprovider";
import messageSchema from "../models/Message.schema";
import { ErrorRes, SuccessRes } from "../utils/Responders";

let MessageProvider = new DataProvider(messageSchema);
export const generateResponse = async (req: Request, res: Response): Promise<any> => {
    try {
        let { prompt } = req.body
        let { id } = req.params
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: 200,
            temperature: 0.7,
            messages: [{ "role": "user", "content": prompt }],
            n: 1,
            user: id,
            stream: true
        })
        if (!completion) new ErrorRes(res, 400, "Unable to generate response!")
        let answer = completion.data.choices[0].message.content
        new SuccessRes(res, 200, answer)
    } catch (error) {
        new ErrorRes(res, 500, "Internal server error!")
    }
}

export async function getConversation(req: Request, res: Response, next: NextFunction) {
    try {
        const data = MessageProvider.getData();
        if (!data) return new ErrorRes(res, 404, "Data not found!")
        return new SuccessRes(res, 200, data)
    } catch (error) {
        return new ErrorRes(res, 500, "Internal server error!")
    }
}