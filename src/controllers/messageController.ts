// import messageSchema from "../models/messageSchema";
// import { Request, Response } from "express";
// import { openai } from "../app";
// import { sendJsonResponse } from "../utils/helper";

// export const generateResponse = async (req:Request, res: Response): Promise<Response> => {
//     try {
//         let { promt } = req.body
//         let { id } = req.params
//         const completion = await openai.createChatCompletion({
//             model: "gpt-3.5-turbo",
//             max_tokens: 100,
//             temperature: 0.7,
//             messages: promt,
//             n: 1,
//             user: id
//         })
//         console.log(completion);
//         sendJsonResponse(res, true, completion);
//         if(!completion) {

//         }
//         let message = completion.data.choices[0].message.content
//     } catch (error) {

//     }
// }