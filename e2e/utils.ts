import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { mockProducts } from './mocks';

const PROJECT_ID = 'angular-ecommerce-b4854';

process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';

initializeApp({ projectId: PROJECT_ID });

const db = getFirestore();

export const clearFirestore = async (): Promise<boolean> => {
  const response = await fetch(
    `http://localhost:8080/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`,
    { method: 'DELETE' }
  );
  return response.ok;
};

export const seedProducts = async (): Promise<void> => {
  const batch = db.batch();
  for (const product of mockProducts) {
    const docRef = db.collection('products').doc(product.id);
    batch.set(docRef, product);
  }
  await batch.commit();
};
