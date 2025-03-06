import * as bcrypt from 'bcrypt';

export class pwBcrypt {
  static async transformPassword(pwd: string): Promise<string> {
    let afterPW = await bcrypt.hash(pwd, 10);
    return afterPW;
  }

  static async validatePwd(pwd: string, savePwd: string): Promise<boolean> {
    const validatePwd = await bcrypt.compare(pwd, savePwd);
    return validatePwd;
  }
}
