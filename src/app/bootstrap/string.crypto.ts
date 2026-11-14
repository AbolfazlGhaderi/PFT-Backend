import { EncryptionService } from '@plugins';

declare global {
  interface String {
    encrypt(): Promise<string>;
    decrypt(): Promise<string>;
  }
}

String.prototype.encrypt = async function (): Promise<string> {
  return await EncryptionService.getInstance().encrypt(this.toString());
};

String.prototype.decrypt = async function (): Promise<string> {
  return await EncryptionService.getInstance().decrypt(this.toString());
};
