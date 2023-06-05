import { Injectable } from '@nestjs/common';
import { EmailAdapter } from '../adapters/email.adapter';

@Injectable()
export class EmailsManager {
  constructor(private EmailAdapter: EmailAdapter) {}

  async sendEmailConfirmationCode(email: string, code: string) {
    const subject = 'Email Confirmation';
    const text = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
        </p>`;

    await this.EmailAdapter.sendEmail(email, subject, text);
  }

  async sendPasswordRecoveryCode(email: string, code: string) {
    const subject = 'Password Recovery';
    const text = `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
        <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
        </p>`;

    await this.EmailAdapter.sendEmail(email, subject, text);
  }
}
