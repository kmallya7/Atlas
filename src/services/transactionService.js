import { transactions } from '../data/mockData.js';
import { createId } from '../utils/id.js';

export async function getTransactions() {
  // TODO: Replace mock return with Firestore listDocuments('transactions', userId).
  return transactions;
}

export async function createTransaction(payload) {
  // TODO: Connect to Firestore createDocument('transactions', { ...payload, userId }).
  return { id: createId('transaction'), splits: payload.splits || [], ...payload };
}

export async function updateTransaction(id, payload) {
  // TODO: Connect to Firestore updateDocument('transactions', id, payload).
  return { id, ...payload };
}

export async function deleteTransaction(id) {
  // TODO: Connect to Firestore deleteDocument('transactions', id).
  return id;
}
