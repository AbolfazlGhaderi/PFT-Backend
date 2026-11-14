import { randomBytes } from 'node:crypto';

export function clearAndUpper(text: string) {
  return text.replace(/-/, '').toUpperCase();
}

export function pascalToKebab(_string: string) {
  return _string
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Insert hyphen between lowercase and uppercase letters
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // Handle cases like "HTMLParser" -> "html-parser"
    .toLowerCase(); // Convert the entire string to lowercase
}

export function toPascalCase(text: string) {
  return text.replace(/\./g, '-').replace(/(^\w|-\w)/g, clearAndUpper);
}

export function toKebabCase(str: string) {
  return str
    .replace(/[_]/g, '-') // Replace underscores and periods with space
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase letters
    .replace(/([a-z])([A-Z])/g, '$1.$2') // Add . between lowercase and uppercase letters
    .replace(/\s+/g, '-') // Replace spaces with hyphen
    .toLowerCase(); // Convert the entire string to lowercase
}

export function generateRandomString(options: { length?: number }): string {
  const length = options.length ?? 15;
  return Array.from({ length }, () => Math.random().toString(36)[2]).join('');
}

export function generateRandomNumber(digits: number) {
  if (digits <= 0) throw new Error('Digits must be a positive integer');

  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;

  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

export function generateRandomByte(size: number) {
  return randomBytes(size).toString('hex');
}

export function generateRolePermissionSignatureString(id: number, roleId: number, permissionId: number, options: { type: 'Plain' | 'base64' }) {
  const signature = `Id=${id},RoleId=${roleId},PermissionId=${permissionId}`;
  if (options.type === 'base64') return btoa(signature);
  return signature;
}

// export class CacheKeyBuilder {
//   static forAccessToken(accessKey: string): string {
//     const hash = createHash('sha256').update(accessKey).digest('hex');

//     return `${PREFIX_CACHE_KEYS.ACCESS_TOKEN}:${hash}`;
//   }

//   static forTelegramAccounts(accountId: string): string {
//     return `${PREFIX_CACHE_KEYS.ACCOUNT}:${accountId}`;
//   }

//   static forCompanyAccount(telegramBotId: string, telegramAccountId: string): string {
//     return `${PREFIX_CACHE_KEYS.COMPANY_ACCOUNT}:${telegramBotId}:${telegramAccountId}`;
//   }

//   static forCompany(companyId: string): string {
//     return `${PREFIX_CACHE_KEYS.COMPANY}:${companyId}`;
//   }
// }
