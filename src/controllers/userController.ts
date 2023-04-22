import crypto from 'node:crypto'
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import userSchema from '../models/User.Schema';
import DataProvider from '../utils/Dataprovider';
import { Cookie, Err, Success } from '../utils/Responders';
import EmailService from '../lib/EmailService';
import { EmailFormat } from '../types/index.type';
import Logger from '../utils/Logger';

let UserProvider = new DataProvider(userSchema);
export const signUp = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { firstName, lastName, email, password } = req.body;
        let savedUser = await userSchema.findOne({ email })
        if (!savedUser) {
            let newUser = await userSchema.create({
                userName: `${firstName} ${lastName}`,
                email,
                password
            });
            newUser.getJWT();
            return Cookie.send(res, newUser, 201);
        }
        return Err.send(res, 409, "User with this email already exists! ")
    } catch (error) {
        Logger.error(error)
        Err.send(res, 500, "Internal server error!")
    }
}

export const signIn = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    const existUser = await userSchema.findOne({ email })
    if (existUser) {
        let matchPass = await bcrypt.compare(password, existUser.password)
        if (matchPass) {
            return Cookie.send(res, existUser, 200);
        }
        return Err.send(res, 400, "Invalid credentials")
    }
    return Err.send(res, 400, "Invalid credentials")
}

export const getUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        let user = UserProvider.getDataByID(id)
        Success.send(res, 200, user)
    } catch (error) {
        Logger.error(error)
        Err.send(res, 500, "Internal server error")
    }
}

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
    try {
        let { email } = req.body;
        let existUser = await UserProvider.getByEmail(email);
        if (!existUser) {
            return Err.send(res, 404, 'User with this email does not exists!')
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
        return emailStatus ? Success.send(res, 201, 'Email has been sent to you') : Err.send(res, 401, 'Unable to send email!')
    } catch (error) {
        console.log(error);
        return Err.send(res, 500, 'Internal server error!')
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
        if (!foundUser) return Err.send(res, 404, 'Token is expired!')
        const { password } = req.body
        foundUser.password = password;
        foundUser.forgotpasstoken = undefined;
        foundUser.forgotpassexpire = undefined;
        await foundUser.save();
    } catch (error) {
        console.log(error);
    }
}