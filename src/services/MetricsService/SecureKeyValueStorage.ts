import {log} from 'shared/logging/config';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

export interface SecureKeyValueStore {
  save(key: string, value: string): Promise<void>;
  retrieve(key: string): Promise<string | null>;
}

export class DefaultSecureKeyValueStore implements SecureKeyValueStore {
  save(key: string, value: string): Promise<void> {
    log.debug({
      category: 'debug',
      message: 'saving new metric in keyValue store',
      payload: `${key} / ${value}`,
    });
    return RNSecureKeyStore.set(key, value, {accssible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY});
  }

  retrieve(key: string): Promise<string | null> {
    log.debug({
      category: 'debug',
      message: 'retrieving metrics in keyValue store',
      payload: `${key}`,
    });
    return RNSecureKeyStore.get(key).catch(() => {
      return null;
    });
  }
}
