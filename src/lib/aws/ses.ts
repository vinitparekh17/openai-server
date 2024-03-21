import * as aws from '@aws-sdk/client-ses';
import { createTransport } from 'nodemailer';
import { EmailFormat } from '../../interface';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION , FROM_EMAIL} from '../../config';
import { Logger } from '../../utils';

const ses = new aws.SES({
    apiVersion: "2010-12-01",
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }
})

export default class EmailService {

    private static transporter = createTransport({
        SES: { ses, aws }
    });

    public static async sendMail(option: EmailFormat): Promise<Boolean> {
        try {
            console.log(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, option)
            EmailService.transporter.sendMail({
                from: FROM_EMAIL,
                ...option
            }, (err) => {
                if (err) {
                    Logger.error(err.message)
                }
            })
            return true;
        } catch (error) {
            Logger.error(error.message)
            return false;
        }
    }
}