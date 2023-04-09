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

    // public async saveData(res: Response, data: any): Promise<any> {
    //     try {
    //         let newChats = await this.model.create(data)
    //         if (!newChats) return new ErrorRes(res, 500, "Internal server issue while message saving!")
    //     } catch (e: any) {
    //         console.log(e);
    //     }
    // }
}