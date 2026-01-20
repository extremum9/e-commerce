/// <reference types="mocha" />

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

const getFirestore = (user?: { uid: string }) =>
  user
    ? testEnv.authenticatedContext(user.uid).firestore()
    : testEnv.unauthenticatedContext().firestore();

const mockUser = { uid: 'user123' };

describe('Firestore security rules', () => {
  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'angular-ecommerce-b4854'
    });
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();

    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      const existingProductDocRef = doc(db, 'products', 'existingDoc');

      await Promise.all([setDoc(existingProductDocRef, { name: 'test product' })]);
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  describe('Authenticated user', () => {
    it('should allow read but NOT write from products collection', async () => {
      const db = getFirestore(mockUser);
      const existingDocRef = doc(db, 'products', 'existingDoc');
      const newDocRef = doc(db, 'products', 'newDoc');

      await Promise.all([
        assertSucceeds(getDoc(existingDocRef)),
        assertFails(setDoc(newDocRef, { name: 'new product' })),
        assertFails(setDoc(existingDocRef, { name: 'updated product' })),
        assertFails(deleteDoc(existingDocRef))
      ]);
    });
  });

  describe('Non-authenticated user', () => {
    it('should allow read but NOT write from products collection', async () => {
      const db = getFirestore();
      const existingDocRef = doc(db, 'products', 'existingDoc');
      const newDocRef = doc(db, 'products', 'newDoc');

      await Promise.all([
        assertSucceeds(getDoc(existingDocRef)),
        assertFails(setDoc(newDocRef, { name: 'new product' })),
        assertFails(setDoc(existingDocRef, { name: 'updated product' })),
        assertFails(deleteDoc(existingDocRef))
      ]);
    });
  });
});
