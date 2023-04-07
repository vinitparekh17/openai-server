import { Model, Types } from "mongoose"
import { ErrorRes, SuccessRes } from "./Responder";
import { Response } from "express";

export default class DataProvider {
    private model: Model<any>
    constructor(model: Model<any>) {
        this.model = model;
    }

    public async getData(): Promise<any[]> {
        try {
            const data = await this.model.find();
            return data;
        } catch (e) {
            console.log(e);
        }
    }

    public async getDataByID(id: string): Promise<any | null> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                return null
            }
            let data = await this.model.findById(id)
            return data
        } catch (e) {
            console.log(e);
        }
    }

    public async saveData(res: Response, data: any): Promise<any> {
        try {
            if (data?.email) {
                let savedUser = await this.model.find({ "email": data.email })
                if (!savedUser) {
                    let user = await this.model.create(data)
                    new SuccessRes(res, 201, user)
                }
                new ErrorRes(res, 409, "User with this email already exists!")
            }
            let newChats = await this.model.create(data)
            if (!newChats) return new ErrorRes(res, 500, "Internal server issue while message saving!")
        } catch (e: any) {
            console.log(e);
        }
    }
}