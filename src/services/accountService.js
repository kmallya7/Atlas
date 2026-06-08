import {
  createFirestoreLoadingState,
  createFirestoreState,
  createUserDocument,
  deleteUserCollectionDocument,
  listUserCollectionDocuments,
  readUserCollectionDocument,
  runFirestoreRequest,
  updateUserCollectionDocument,
  userCollections,
} from './firestore.service.js';

const collectionName = userCollections.accounts;

// Future use: Accounts page forms will call these functions after mock data is replaced.
// All documents live under users/{userId}/accounts so each signed-in user owns only their data.
export function createAccountsState() {
  return createFirestoreState([]);
}

export function createAccountsLoadingState(data = []) {
  return createFirestoreLoadingState(data);
}

export function listAccounts(userId) {
  return runFirestoreRequest(() => listUserCollectionDocuments(userId, collectionName));
}

export function readAccount(userId, accountId) {
  return runFirestoreRequest(() => readUserCollectionDocument(userId, collectionName, accountId));
}

export function createAccount(userId, payload) {
  return runFirestoreRequest(async () => {
    const ref = await createUserDocument(userId, collectionName, normalizeAccount(payload));
    return { id: ref.id, ...normalizeAccount(payload) };
  });
}

export function updateAccount(userId, accountId, payload) {
  return runFirestoreRequest(async () => {
    await updateUserCollectionDocument(userId, collectionName, accountId, normalizeAccount(payload));
    return { id: accountId, ...normalizeAccount(payload) };
  });
}

export function deleteAccount(userId, accountId) {
  return runFirestoreRequest(async () => {
    await deleteUserCollectionDocument(userId, collectionName, accountId);
    return accountId;
  });
}

function normalizeAccount(payload = {}) {
  return {
    name: payload.name || '',
    type: payload.type || 'Bank account',
    institution: payload.institution || '',
    openingBalance: Number(payload.openingBalance || 0),
    balance: Number(payload.balance || 0),
    currency: payload.currency || 'INR',
    status: payload.status || 'Manual account',
    notes: payload.notes || '',
    isActive: payload.isActive ?? true,
  };
}
