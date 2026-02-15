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
      const existingWishlistDocRef = doc(db, 'users', mockUser.uid, 'wishlist', 'existingDoc');

      await Promise.all([
        setDoc(existingProductDocRef, { name: 'test' }),
        setDoc(existingWishlistDocRef, { productId: 'test' })
      ]);
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  describe('Products collection', () => {
    it('should allow read but NOT write for non-authenticated users', async () => {
      const db = getFirestore();
      const existingDocRef = doc(db, 'products', 'existingDoc');
      const newDocRef = doc(db, 'products', 'newDoc');

      await Promise.all([
        assertSucceeds(getDoc(existingDocRef)),
        assertFails(setDoc(newDocRef, { name: 'test' })),
        assertFails(setDoc(existingDocRef, { name: 'test' })),
        assertFails(deleteDoc(existingDocRef))
      ]);
    });

    it('should allow read but NOT write for authenticated users', async () => {
      const db = getFirestore(mockUser);
      const existingDocRef = doc(db, 'products', 'existingDoc');
      const newDocRef = doc(db, 'products', 'newDoc');

      await Promise.all([
        assertSucceeds(getDoc(existingDocRef)),
        assertFails(setDoc(newDocRef, { name: 'test' })),
        assertFails(setDoc(existingDocRef, { name: 'test' })),
        assertFails(deleteDoc(existingDocRef))
      ]);
    });
  });

  describe('Wishlist collection', () => {
    it('should NOT allow read and write for non-authenticated users', async () => {
      const db = getFirestore();
      const existingDocRef = doc(db, 'users', mockUser.uid, 'wishlist', 'existingDoc');
      const newDocRef = doc(db, 'users', mockUser.uid, 'wishlist', 'newDoc');

      await Promise.all([
        assertFails(getDoc(existingDocRef)),
        assertFails(setDoc(newDocRef, { productId: 'test' })),
        assertFails(setDoc(existingDocRef, { productId: 'test' })),
        assertFails(deleteDoc(existingDocRef))
      ]);
    });

    it('should allow read and write if userId matches authenticated userId', async () => {
      const db = getFirestore(mockUser);
      const existingDocRef = doc(db, 'users', mockUser.uid, 'wishlist', 'existingDoc');
      const newDocRef = doc(db, 'users', mockUser.uid, 'wishlist', 'newDoc');

      await Promise.all([
        assertSucceeds(getDoc(existingDocRef)),
        assertSucceeds(setDoc(newDocRef, { productId: 'test' })),
        assertSucceeds(setDoc(existingDocRef, { productId: 'test' })),
        assertSucceeds(deleteDoc(existingDocRef))
      ]);
    });

    it('should NOT allow read and write if userId DOES NOT match authenticated userId', async () => {
      const db = getFirestore({ uid: 'user456' });
      const existingDocRef = doc(db, 'users', mockUser.uid, 'wishlist', 'existingDoc');
      const newDocRef = doc(db, 'users', mockUser.uid, 'wishlist', 'newDoc');

      await Promise.all([
        assertFails(getDoc(existingDocRef)),
        assertFails(setDoc(newDocRef, { productId: 'test' })),
        assertFails(setDoc(existingDocRef, { productId: 'test' })),
        assertFails(deleteDoc(existingDocRef))
      ]);
    });
  });
});
