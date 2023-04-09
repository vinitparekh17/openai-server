import userSchema from '../models/userSchema';
import DataProvider from '../utils/Dataprovider';
import crypto from 'node:crypto'
import { Request, Response } from 'express';
import { ErrorRes, SuccessRes } from '../utils/Responders';
import EmailService from '../utils/EmailService';
import EmailFormat from '../types/Email.types';

let UserProvider = new DataProvider(userSchema);
export const signup = async (req: Request, res: Response): Promise<any> => {
    try {
        let savedUser = await userSchema.find({ email: req.body.email })
        if (!savedUser) {
            let newUser = await userSchema.create(req.body)
            new SuccessRes(res, 201, newUser)
        }
        new ErrorRes(res, 409, "User with this email already exists!")
    } catch (error) {
        new ErrorRes(res, 500, "Internal server error!")
    }
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

export const passwardReset =async (req: Request, res: Response) => {
    try {
        const {token} = req.params
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
        if(!foundUser) return new ErrorRes(res, 404, 'Token is expired!')
        const { password } = req.body
        foundUser.password = password;
        foundUser.forgotpasstoken = undefined;
        foundUser.forgotpassexpire = undefined;
        await foundUser.save();
    } catch (error) {
        console.log(error);
    }
}