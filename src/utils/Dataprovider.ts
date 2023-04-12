import { Model, Types } from "mongoose"

export default class DataProvider {
    private model: Model<any>
    constructor(model: Model<any>) {
        this.model = model;
    }

    public async getData(): Promise<any[]> {
        try {
            const data = await this.model.find();
            if(!data) return []
            return data;
        } catch (e) {
            console.log(e);
        }
    }

    public async getDataBySearch(key: string, value: string): Promise<any[]> {
        try {
            const data = await this.model.find({key: value});
            if(!data) return []
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

    public async getByEmail(email: string): Promise<any> {
        try {
            let existUser = await this.model.find({ email });
            return existUser ? existUser : null;
        } catch (error) {
            console.log(error);
        }
    }
}