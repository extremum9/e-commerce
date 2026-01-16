import * as crypto from 'crypto';

import { initializeApp } from 'firebase-admin/app';

process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';

initializeApp({ projectId: 'angular-ecommerce-b4854' });

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const getRandomString = (length = 10): string => {
  const randomBytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHABET[randomBytes[i] % ALPHABET.length];
  }
  return result;
};
