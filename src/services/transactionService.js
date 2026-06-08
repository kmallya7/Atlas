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

const collectionName = userCollections.transactions;

// Future use: Transactions filters and forms will call these functions once the mock table is replaced.
// Transaction documents are scoped to users/{userId}/transactions and can reference account/category names or IDs.
export function createTransactionsState() {
  return createFirestoreState([]);
}

export function createTransactionsLoadingState(data = []) {
  return createFirestoreLoadingState(data);
}

export function listTransactions(userId) {
  return runFirestoreRequest(() => listUserCollectionDocuments(userId, collectionName));
}

export function readTransaction(userId, transactionId) {
  return runFirestoreRequest(() => readUserCollectionDocument(userId, collectionName, transactionId));
}

export function createTransaction(userId, payload) {
  return runFirestoreRequest(async () => {
    const transaction = normalizeTransaction(payload);
    const ref = await createUserDocument(userId, collectionName, transaction);
    return { id: ref.id, ...transaction };
  });
}

export function updateTransaction(userId, transactionId, payload) {
  return runFirestoreRequest(async () => {
    const transaction = normalizeTransaction(payload);
    await updateUserCollectionDocument(userId, collectionName, transactionId, transaction);
    return { id: transactionId, ...transaction };
  });
}

export function deleteTransaction(userId, transactionId) {
  return runFirestoreRequest(async () => {
    await deleteUserCollectionDocument(userId, collectionName, transactionId);
    return transactionId;
  });
}

function normalizeTransaction(payload = {}) {
  return {
    merchant: payload.merchant || '',
    category: payload.category || '',
    account: payload.account || '',
    type: payload.type || 'expense',
    amountValue: Number(payload.amountValue || payload.amount || 0),
    currency: payload.currency || 'INR',
    isoDate: payload.isoDate || '',
    notes: payload.notes || '',
    splits: Array.isArray(payload.splits) ? payload.splits : [],
  };
}
