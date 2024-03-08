import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { DataProvider, Success, Err, Cookie } from "../utils";
import { AsyncHandler } from "../handlers";
import UserSchema from "../models/User.schema";
import MessageSchema from '../models/Message.schema';
import GoogleUserSchema from '../models/GoogleUser.schema';
import { MessageDocument, MessageModel } from '../interface';

export const signIn = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { type } = req.query as { type: 'normal' | 'google' };
    if (type === 'normal') {
      const { email, password } = req.body;

      const existUser = await UserSchema.findOne({ email });

      if (existUser) {

        let matchPass = await bcrypt.compare(password, existUser.password);

        if (matchPass) {
          return Cookie.send(res, req, existUser, 200);
        }

        return Err.send(res, 400, 'Invalid credentials');
      }

      return Err.send(res, 400, 'Invalid credentials');

    } else if (type === 'google') {

      const { email } = req.body;
      const existUser = await GoogleUserSchema.findOne({ email });

      if (existUser) {
        return Cookie.send(res, req, existUser, 200);
      }

      return Err.send(res, 400, 'Invalid credentials');

    }
  },
);

export const GetAllUsers = AsyncHandler(
  async (_: Request, res: Response): Promise<Response> => {

    let userData = await DataProvider.getData(UserSchema);
    if (userData.length == 0) return Err.send(res, 404, 'Users not found');
    return Success.send(res, 200, userData);
  })

export const GetUserById = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    let userData = await DataProvider.getDataByID(UserSchema, id);

    if (userData.length == 0) return Err.send(res, 404, 'Users not found');
    return Success.send(res, 200, userData);
  })

export const DeleteUserById = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    let userData = await DataProvider.deleteDataById(UserSchema, id);
    if (userData.length == 0) return Err.send(res, 404, 'Users not found');
    return Success.send(res, 200, userData);
  })

export const UpdateUserById = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    let userData = await DataProvider.updateDataById(UserSchema, id, req.body);
    if (userData.length == 0) return Err.send(res, 404, 'Users not found');
    return Success.send(res, 200, userData);
  })