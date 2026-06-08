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

const collectionName = userCollections.budgets;

// Future use: Budget cards and budget modals will read and write users/{userId}/budgets.
// The current Budgets page still uses mock state, so these calls stay dormant until UI wiring begins.
export function createBudgetsState() {
  return createFirestoreState([]);
}

export function createBudgetsLoadingState(data = []) {
  return createFirestoreLoadingState(data);
}

export function listBudgets(userId) {
  return runFirestoreRequest(() => listUserCollectionDocuments(userId, collectionName));
}

export function readBudget(userId, budgetId) {
  return runFirestoreRequest(() => readUserCollectionDocument(userId, collectionName, budgetId));
}

export function createBudget(userId, payload) {
  return runFirestoreRequest(async () => {
    const budget = normalizeBudget(payload);
    const ref = await createUserDocument(userId, collectionName, budget);
    return { id: ref.id, ...budget };
  });
}

export function updateBudget(userId, budgetId, payload) {
  return runFirestoreRequest(async () => {
    const budget = normalizeBudget(payload);
    await updateUserCollectionDocument(userId, collectionName, budgetId, budget);
    return { id: budgetId, ...budget };
  });
}

export function deleteBudget(userId, budgetId) {
  return runFirestoreRequest(async () => {
    await deleteUserCollectionDocument(userId, collectionName, budgetId);
    return budgetId;
  });
}

function normalizeBudget(payload = {}) {
  return {
    category: payload.category || '',
    group: payload.group || 'essentials',
    monthlyLimit: Number(payload.monthlyLimit || 0),
    spentAmount: Number(payload.spentAmount || 0),
    budgetPeriod: payload.budgetPeriod || '',
    notes: payload.notes || '',
  };
}
