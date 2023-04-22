import crypto from 'node:crypto'
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import userSchema from '../models/User.schema';
import DataProvider from '../utils/Dataprovider';
import { ErrorRes, SuccessRes } from '../utils/Responders';
import EmailService from '../lib/EmailService';
import { EmailFormat } from '../types/index.type';
import Logger from '../utils/Logger';

let UserProvider = new DataProvider(userSchema);
export const signUp = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { firstName, lastName, email, password } = req.body;
        let savedUser = await userSchema.findOne({ email })
        if (!savedUser) {
            let newUser = {
                userName: `${firstName} ${lastName}`,
                email,
                password
            }
            await userSchema.create(newUser);
            return new SuccessRes(res, 201, newUser).send()
        }
        return new ErrorRes(res, 409, "User with this email already exists! ").send()
    } catch (error) {
        Logger.error(error)
        new ErrorRes(res, 500, "Internal server error!").send()
    }
}

export const signIn = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    const existUser = await userSchema.findOne({ email })
    if (existUser) {
        let matchPass = await bcrypt.compare(password, existUser.password)
        if (matchPass) {
            return new SuccessRes(res, 200, existUser).send()
        }
        return new ErrorRes(res, 400, "Invalid credentials").send()
    }
    return new ErrorRes(res, 400, "Invalid credentials").send()
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

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
    try {
        let { email } = req.body;
        let existUser = await UserProvider.getByEmail(email);
        if (!existUser) {
            return new ErrorRes(res, 404, 'User with this email does not exists!')
        }
        let token = existUser.getForgotToken();
        await existUser.save({ validateBeforeSave: false });
        let url = `${req.protocol}://${req.get("host")}/api/passward/reset/${token}`
        let options: EmailFormat = {
            to: email,
            suject: 'Forgot password token',
            content: '',
            html: `Click here to change your password! \n\n<center><a href="${url}" ><button>FORGOT PASSWORD</button></a><center>`
        }
        let emailStatus = new EmailService(options).sendMail();
        return emailStatus ? new SuccessRes(res, 201, 'Email has been sent to you') : new ErrorRes(res, 401, 'Unable to send email!')
    } catch (error) {
        console.log(error);
        return new ErrorRes(res, 500, 'Internal server error!')
    }
}

export const passwardReset = async (req: Request, res: Response) => {
    try {
        const { token } = req.params
        const encryptedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex")
        // $gt is the classic mongodb query with refers to greater then 
        const foundUser = await userSchema.findOne({
            encryptedToken,
            forgotPasswordExpiry: {
                $gt: Date.now()
            }
        })
        if (!foundUser) return new ErrorRes(res, 404, 'Token is expired!')
        const { password } = req.body
        foundUser.password = password;
        foundUser.forgotpasstoken = undefined;
        foundUser.forgotpassexpire = undefined;
        await foundUser.save();
    } catch (error) {
        console.log(error);
    }
}