import { accounts } from '../data/mockData.js';
import { createId } from '../utils/id.js';

export async function getAccounts() {
  // TODO: Replace mock return with Firestore listDocuments('accounts', userId).
  return accounts;
}

export async function createAccount(payload) {
  // TODO: Connect to Firestore createDocument('accounts', { ...payload, userId }).
  return { id: createId('account'), ...payload };
}
