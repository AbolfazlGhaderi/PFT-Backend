import { EnvKeys } from '@enums';
import { EnvLoaderService } from '@plugins';
import { CryptoService } from './crypto.service.js';
import { generateEncryptionString } from './helper.js';

export class EncryptionService extends CryptoService {
  private static instance: EncryptionService;

  private constructor(masterKey?: string) {
    const _masterKey = masterKey ?? EnvLoaderService.getOrFail(EnvKeys.ENCRYPTION_KEY);
    if (!_masterKey || _masterKey.length < EnvLoaderService.getOrFail<number>(EnvKeys.ENCRYPTION_KEY_MIN_LENGTH)) {
      throw new Error('Master key too weak');
    }
    super(_masterKey);
  }

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  async encrypt(data: string) {
    const encryptionVersion = EnvLoaderService.getOrFail(EnvKeys.ENCRYPTION_VERSION);
    const encryptionStartName = generateEncryptionString(encryptionVersion);
    return encryptionStartName + (await this.encryptText(data));
  }

  async decrypt(cipherText: string) {
    const encryptionVersion = EnvLoaderService.getOrFail(EnvKeys.ENCRYPTION_VERSION);
    const encryptionStartName = generateEncryptionString(encryptionVersion);
    if (!cipherText.startsWith(encryptionStartName)) {
      throw new Error(`Invalid encryption version => CipherText: ${cipherText.slice(0, 10)}...`);
    }
    const encryptedText = cipherText.slice(encryptionStartName.length);
    return await this.decryptText(encryptedText);
  }
}
