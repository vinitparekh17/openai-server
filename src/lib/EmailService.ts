import { createTransport } from "nodemailer";
import { EmailFormat } from "../types/index.type";

export default class EmailService {
  private optionData: EmailFormat;
  private transporter = createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: "",
      pass: "",
    },
    tls: {
      rejectUnauthorized: false,
      ciphers: "SSLv3",
    },
  });
  constructor(option: EmailFormat) {
    this.optionData = option;
  }

  public async sendMail(): Promise<Boolean> {
    try {
      await this.transporter.sendMail(this.optionData);
      return true;
    } catch (error) {
      return false;
      console.log(error);
    }
  }
}
