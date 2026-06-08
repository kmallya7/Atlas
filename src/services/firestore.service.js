import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

export const userCollections = {
  accounts: 'accounts',
  transactions: 'transactions',
  budgets: 'budgets',
  goals: 'goals',
  loans: 'loans',
  categories: 'categories',
  settings: 'settings',
};

export function createFirestoreState(data = null) {
  return {
    data,
    error: '',
    loading: false,
  };
}

export function createFirestoreLoadingState(data = null) {
  return {
    data,
    error: '',
    loading: true,
  };
}

export async function runFirestoreRequest(request) {
  try {
    const data = await request();
    return createFirestoreState(data);
  } catch (error) {
    return {
      data: null,
      error: friendlyFirestoreError(error),
      loading: false,
    };
  }
}

export function userDocumentRef(userId) {
  requireUserId(userId);
  return doc(db, 'users', userId);
}

export function userCollectionRef(userId, collectionName) {
  requireUserId(userId);
  requireCollectionName(collectionName);
  return collection(db, 'users', userId, collectionName);
}

export function userCollectionDocumentRef(userId, collectionName, documentId) {
  requireUserId(userId);
  requireCollectionName(collectionName);
  requireDocumentId(documentId);
  return doc(db, 'users', userId, collectionName, documentId);
}

export async function ensureUserDocument(userId, profile = {}) {
  const ref = userDocumentRef(userId);

  await setDoc(
    ref,
    {
      ...stripUndefined(profile),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return { id: userId, ...profile };
}

export async function readUserDocument(userId) {
  const snapshot = await getDoc(userDocumentRef(userId));
  return snapshot.exists() ? serializeDocument(snapshot) : null;
}

export function createUserDocument(userId, collectionName, payload) {
  return addDoc(userCollectionRef(userId, collectionName), {
    ...stripUndefined(payload),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function readUserCollectionDocument(userId, collectionName, documentId) {
  const snapshot = await getDoc(userCollectionDocumentRef(userId, collectionName, documentId));
  return snapshot.exists() ? serializeDocument(snapshot) : null;
}

export async function listUserCollectionDocuments(userId, collectionName) {
  const documentsQuery = query(userCollectionRef(userId, collectionName), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(documentsQuery);
  return snapshot.docs.map(serializeDocument);
}

export function updateUserCollectionDocument(userId, collectionName, documentId, payload) {
  return updateDoc(userCollectionDocumentRef(userId, collectionName, documentId), {
    ...stripUndefined(payload),
    updatedAt: serverTimestamp(),
  });
}

export function deleteUserCollectionDocument(userId, collectionName, documentId) {
  return deleteDoc(userCollectionDocumentRef(userId, collectionName, documentId));
}

function serializeDocument(snapshot) {
  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

function stripUndefined(payload = {}) {
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
}

function requireUserId(userId) {
  if (!userId) {
    throw new Error('A signed-in user ID is required for Firestore user data.');
  }
}

function requireCollectionName(collectionName) {
  if (!Object.values(userCollections).includes(collectionName)) {
    throw new Error(`Unsupported Firestore user collection: ${collectionName}`);
  }
}

function requireDocumentId(documentId) {
  if (!documentId) {
    throw new Error('A Firestore document ID is required.');
  }
}

function friendlyFirestoreError(error) {
  if (error?.code === 'permission-denied') {
    return 'You do not have permission to access this Atlas data yet.';
  }

  if (error?.code === 'unavailable') {
    return 'Firestore is temporarily unavailable. Please try again shortly.';
  }

  if (error?.message) {
    return error.message;
  }

  return 'Something went wrong while preparing Atlas data.';
}
