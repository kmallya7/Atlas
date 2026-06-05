import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase.js';

export async function listDocuments(collectionName, userId) {
  const q = query(collection(db, collectionName), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export function createDocument(collectionName, payload) {
  return addDoc(collection(db, collectionName), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function updateDocument(collectionName, id, payload) {
  return updateDoc(doc(db, collectionName, id), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export function deleteDocument(collectionName, id) {
  return deleteDoc(doc(db, collectionName, id));
}
