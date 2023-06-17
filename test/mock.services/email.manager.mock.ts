import { EmailsManager } from '../../src/managers/email.sender.manager';
import { EmailAdapter } from '../../src/adapters/email.adapter';

export class EmailManagerMock extends EmailsManager {
  constructor() {
    super(new EmailAdapter());
  }

  async sendEmailConfirmationCode(email: string, code: string): Promise<void> {
    await Promise.resolve();
  }

  async sendPasswordRecoveryCode(email: string, code: string): Promise<void> {
    await Promise.resolve();
  }
}
