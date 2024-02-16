import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { AsyncHandler } from '../handlers';
import UserSchema from '../models/User.schema';
import GoogleUserSchema from '../models/GoogleUser.schema';
import BotSchema from '../models/Bot.schema';
import { EmailFormat } from '../interface';
import EmailService from '../lib/common/EmailService';
import type { Request, Response } from 'express';
import { Cookie, Err, Success, DataProvider, Logger } from '../utils';

export const signUp = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { type } = req.query;
    if (type === 'normal') {
      const { firstName, lastName, email, password } = req.body;
      console.log(req.body);

      if (!firstName || !lastName || !email || !password)
        return Err.send(res, 400, 'Please fill all the fields!');
      let existUser = await UserSchema.findOne({ email });
      if (!existUser) {
        let newUser = await UserSchema.create({
          name: `${firstName} ${lastName}`,
          email,
          password,
        });
        return Cookie.send(res, req, newUser, 201);
      } else {
        return Err.send(res, 409, 'User with this email already exists! ');
      }
    } else if (type === 'google') {
      const { email, profile, name, expire } = req.body;
      console.log(req.body);

      const existUser = await GoogleUserSchema.findOne({ email });
      if (!existUser) {
        const newUser = await GoogleUserSchema.create({
          email,
          profile,
          name,
          expire,
        });
        return Cookie.send(res, req, newUser, 201);
      } else {
        return Err.send(
          res,
          409,
          'User with this email already exists go to login! ',
        );
      }
    } else {
      return Err.send(res, 400, 'Invalid request type!');
    }
  },
);

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

export const forgotPassword = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    let { email } = req.body;
    let existUser = await DataProvider.getByEmail(UserSchema, email);
    if (!existUser) {
      return Err.send(res, 404, 'User with this email does not exists!');
    }
    let token = existUser.getForgotToken();
    await existUser.save({ validateBeforeSave: false });
    let url = `${req.protocol}://${req.get(
      'host',
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
  },
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
  },
);

export const profile = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    let { id } = req.params;
    let user = await DataProvider.getDataByID(UserSchema, id);
    if (!user) return Err.send(res, 404, 'User not found');
    let bots = await DataProvider.getDataBySearch(BotSchema, 'user', id);
    if (user && !bots) return Success.send(res, 200, { user });
    return Success.send(res, 200, { user, bots });
  },
);

export const signOut = AsyncHandler(
  async (_req: Request, res: Response): Promise<Response> => {
    return res
      .clearCookie('chatplus-token')
      .status(200)
      .json({ success: true, message: 'Successfully logged out!' });
  },
);
