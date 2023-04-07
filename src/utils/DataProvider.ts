import { Model, Types } from "mongoose"
import { sendJsonResponse } from "./responseHandler";

export default class DataProvider {
    private model: Model<any>
    constructor(model: Model<any>) {
        this.model = model;
    }

public async getData(): Promise<any[]> {
    const data = await this.model.find();
    return data;
}

public async getDataByID(id: string): Promise<any | null> {
    if (!Types.ObjectId.isValid(id)) {
        return null
    }
    let data = await this.model.findById(id)
    return data
}
}