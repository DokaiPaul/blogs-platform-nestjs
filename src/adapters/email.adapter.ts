import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailAdapter {
  async sendEmail(email: string, subject: string, message: string) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'denchik.excel@gmail.com',
        pass: 'wozfyuujebcyrvtf',
      },
    });

    const info = await transport.sendMail({
      from: `Pashych <denchik.excel@gmail.com>`,
      to: email,
      subject,
      html: message,
    });

    return info;
  }
}
