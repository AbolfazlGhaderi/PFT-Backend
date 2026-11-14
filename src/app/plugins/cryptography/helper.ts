import { EnvKeys } from '@enums';
import { EnvLoaderService } from '@plugins';

export function generateEncryptionString(version: string) {
  return EnvLoaderService.getOrFail<string>(EnvKeys.ENCRYPTION_PREFIX) + '_' + version + ':';
}
