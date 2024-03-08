import { Model, Types } from 'mongoose';
import { Logger } from './';

export class DataProvider {
  static async getData(model: Model<any>): Promise<any[]> {
    try {
      const data = await model.find();
      if (!data) return [];
      return data;
    } catch (e) {
      Logger.error(e);
    }
  }

  static async getDataBySearch(
    model: Model<any>,
    k: string,
    v: string,
  ): Promise<any[]> {
    try {
      const data = await model.find({ [k]: v });
      if (!data) return [];
      return data;
    } catch (e) {
      Logger.error(e);
    }
  }

  static async updateDataById<T, U>(model: Model<T>,id: string , object: U): Promise<any>{
    try {
       const data = await model.findByIdAndUpdate(id, object);
       if(!data) return;
       return data
    } catch (error) {
      Logger.error(error)
    }
  }

  static async getDataByID<T>(model: Model<T>, id: string): Promise<any | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }
      let data = await model.findById(id);
      return data;
    } catch (e) {
      Logger.error(e);
    }
  }

  static async deleteDataById<T>(model: Model<T>, id: string): Promise<any | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }
      let data = await model.findByIdAndDelete(id);
      return data;
    } catch (e) {
      Logger.error(e);
    }
  }

  static async getByEmail(
    model: Model<any>,
    email: string,
  ): Promise<any | null> {
    try {
      let data = await model.findOne({ email });
      return data || null;
    } catch (error) {}
  }
}
