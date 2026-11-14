import * as crypto from 'node:crypto';

export class CryptoService {
  private static readonly ALGO = 'aes-256-gcm';
  private static readonly SALT_LEN = 16;
  private static readonly IV_LEN = 12;
  private static readonly TAG_LEN = 16;
  private static readonly KEY_LEN = 32;
  private static readonly ITER = 100_000;
  private static readonly DIGEST = 'sha512';

  constructor(private readonly masterKey: string) {
    if (!masterKey || masterKey.length < 16) {
      throw new Error('Master key too weak');
    }
  }

  private deriveKey(salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(this.masterKey, salt, CryptoService.ITER, CryptoService.KEY_LEN, CryptoService.DIGEST, (err, key) => (err ? reject(err) : resolve(key)));
    });
  }

  async encryptText(text: string): Promise<string> {
    const salt = crypto.randomBytes(CryptoService.SALT_LEN);
    const iv = crypto.randomBytes(CryptoService.IV_LEN);
    const key = await this.deriveKey(salt);

    const cipher = crypto.createCipheriv(CryptoService.ALGO, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
  }

  async decryptText(payload: string): Promise<string> {
    const data = Buffer.from(payload, 'base64');

    const minLen = CryptoService.SALT_LEN + CryptoService.IV_LEN + CryptoService.TAG_LEN;

    if (data.length < minLen) {
      throw new Error('Invalid cipher payload');
    }

    let offset = 0;
    const salt = data.subarray(offset, (offset += CryptoService.SALT_LEN));
    const iv = data.subarray(offset, (offset += CryptoService.IV_LEN));
    const tag = data.subarray(offset, (offset += CryptoService.TAG_LEN));
    const encrypted = data.subarray(offset);

    const key = await this.deriveKey(salt);

    const decipher = crypto.createDecipheriv(CryptoService.ALGO, key, iv);
    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  }
}
