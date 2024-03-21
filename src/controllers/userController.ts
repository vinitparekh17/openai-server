import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { AsyncHandler } from '../handlers';
import UserSchema from '../models/User.schema';
import GoogleUserSchema from '../models/GoogleUser.schema';
import { EmailFormat } from '../interface';
import EmailService from '../lib/aws/ses';
import type { Request, Response } from 'express';
import { Cookie, Err, Success } from '../utils';
import MessageSchema from '../models/Message.schema';
import { PasswordResetTemplate, SignUpTemplate } from '../utils/Template';

export const signUp = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return Err.send(res, 400, 'Please fill all the fields!');
    }

    let existUser = await UserSchema.findOne({ email });

    if (!existUser) {

      let newUser = await UserSchema.create({
        name: `${firstName} ${lastName}`,
        email,
        password,
      })

      EmailService.sendMail({
        to: newUser.email,
        subject: 'Signed Up Successfully | Omnisive',
        html: SignUpTemplate(newUser.name)
      })

      return Cookie.send(res, req, newUser, 201);

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
          return Cookie.send(res, req, existUser, 200);
        }
        return Err.send(res, 400, 'Password did not matched');
      }
      return Err.send(res, 400, 'User with these credentials does not exists');
  },
);

export const forgotPassword = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    let { email } = req.body;

    let existUser = await UserSchema.findOne({ email });

    if (!existUser) {
      return Err.send(res, 404, 'User with this email does not exists!');
    }

    let token = existUser.getForgotToken();

    await existUser.save({ validateBeforeSave: false });

    let url = `${req.protocol}://${req.hostname}/passward/reset?token=${token}`;

    let options: EmailFormat = {
      to: email,
      subject: 'Password Reset Requested | Omnisive',
      html: PasswordResetTemplate(url)
    };

    let emailStatus = EmailService.sendMail(options);

    return emailStatus
      ? Success.send(res, 201, 'Email has been sent to you')
      : Err.send(res, 401, 'Unable to send email!');
  }
);

export const passwardReset = AsyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;

    const foundUser = await UserSchema.findOne({
      forgotpasstoken: token,
      forgotpassexpire: { $gt: Date.now() }
    });

    if (!foundUser) return Err.send(res, 400, 'Token is invalid or expired')

    const { password } = req.body;

    foundUser.password = password;
    foundUser.forgotpasstoken = undefined;
    foundUser.forgotpassexpire = undefined;

    await foundUser.save();

    return Success.send(res, 200, 'Password has been reset successfully');
  }
);

export const profile = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    let user = req.user;
    if (!user) return Err.send(res, 404, 'User not found');
    return Success.send(res, 200, user);
  }
);

export const updateAccount = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { firstName, lastName, email, profile } = req.body

    const updatedUser = await UserSchema.findByIdAndUpdate(req.params.id, {
      name: `${firstName} ${lastName}`,
      email,
      profile: parseInt(profile)
    }, { new: true }).select('-password')
    req.user = updatedUser
    return Success.send(res, 200, updatedUser)
  }
);

export const deleteAccount = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params
    await UserSchema.findByIdAndDelete(id)
    await MessageSchema.deleteMany({ user: id })
    return Success.send(res, 202, "User has been deleted successfully")
  }
);

export const signOut = AsyncHandler(
  async (_req: Request, res: Response): Promise<Response> => {
    return res
      .clearCookie('chatplus-token')
      .status(200)
      .json({ success: true, message: 'Successfully logged out!' });
  }
);

export const googleSignIn = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { email, name } = req.body;

    const existUser = await GoogleUserSchema.findOne({ email });

    if (existUser) {
      return Cookie.send(res, req, existUser, 200);
    } else {
    
      let newUser = await GoogleUserSchema.create({
        name,
        email,
      });

      return Cookie.send(res, req, newUser, 201);
    }
  }
);