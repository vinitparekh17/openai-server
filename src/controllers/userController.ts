import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import UserSchema from '../models/User.schema';
import Logger from '../utils/Logger';
import DataProvider from '../utils/Dataprovider';
import { Cookie, Err, Success } from '../utils/Responders';
import EmailService from '../lib/EmailService';
import { AsyncHandler } from '../handlers';
import { EmailFormat } from '../types/index.type';

export const signUp = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { firstName, lastName, email, password } = req.body;
    let savedUser = await UserSchema.findOne({ email });
    if (!savedUser) {
      let newUser = await UserSchema.create({
        userName: `${firstName} ${lastName}`,
        email,
        password,
      });
      return Cookie.send(res, newUser, 201);
    } else {
      return Err.send(res, 409, 'User with this email already exists! ');
    }
  }
);

export const signIn = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    const existUser = await UserSchema.findOne({ email });
    if (existUser) {
      let matchPass = await bcrypt.compare(password, existUser.password);
      if (matchPass) {
        return Cookie.send(res, existUser, 200);
      }
      return Err.send(res, 400, 'Invalid credentials');
    }
    return Err.send(res, 400, 'Invalid credentials');
  }
);

export const getUser = AsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    let user = await DataProvider.getDataByID(UserSchema, id);
    Success.send(res, 200, user);
  }
);

export const forgotPassword = AsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    let { email } = req.body;
    let existUser = await DataProvider.getByEmail(UserSchema, email);
    if (!existUser) {
      return Err.send(res, 404, 'User with this email does not exists!');
    }
    let token = existUser.getForgotToken();
    await existUser.save({ validateBeforeSave: false });
    let url = `${req.protocol}://${req.get(
      'host'
    )}/api/passward/reset/${token}`;
    let options: EmailFormat = {
      to: email,
      suject: 'Forgot password token',
      content: '',
      html: `Click here to change your password! \n\n<center><a href="${url}" ><button>FORGOT PASSWORD</button></a><center>`,
    };
    let emailStatus = new EmailService(options).sendMail();
    return emailStatus
      ? Success.send(res, 201, 'Email has been sent to you')
      : Err.send(res, 401, 'Unable to send email!');
  }
);

export const passwardReset = AsyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const encryptedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    // $gt is the classic mongodb query with refers to greater then
    const foundUser = await UserSchema.findOne({
      encryptedToken,
      forgotPasswordExpiry: {
        $gt: Date.now(),
      },
    });
    if (!foundUser) return Err.send(res, 404, 'Token is expired!');
    const { password } = req.body;
    foundUser.password = password;
    foundUser.forgotpasstoken = undefined;
    foundUser.forgotpassexpire = undefined;
    await foundUser.save();
  }
);

export const Protected = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    Logger.debug('Protected route triggered');
    return res
      .status(200)
      .json({ success: true, message: 'Protected route triggered' });
  }
);

export const signOut = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    Logger.debug('Signout route triggered');
    res.clearCookie('chatplus-token');
    return res
      .status(200)
      .json({ success: true, message: 'Signout successfully' });
  }
);
