import userSchema from "../models/userSchema";
import { Request, Response } from "express";
import DataProvider from "../utils/DbHelper";
import { ErrorRes, SuccessRes } from "../utils/Responder";

let UserProvider = new DataProvider(userSchema);
export const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        return UserProvider.saveData(res, req.body)
    } catch (error) {
        new ErrorRes(res, 500, "Internal server error!")
    }
}

export const getUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        let user = UserProvider.getDataByID(id)
        new SuccessRes(res, 200, user)
    } catch (error) {
        new ErrorRes(res, 500, "Internal server error")
    }
}