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

const collectionName = userCollections.goals;

// Future use: Goals and payoff targets will be stored at users/{userId}/goals.
// Mock goal cards remain active until the Goals page is explicitly wired to this service.
export function createGoalsState() {
  return createFirestoreState([]);
}

export function createGoalsLoadingState(data = []) {
  return createFirestoreLoadingState(data);
}

export function listGoals(userId) {
  return runFirestoreRequest(() => listUserCollectionDocuments(userId, collectionName));
}

export function readGoal(userId, goalId) {
  return runFirestoreRequest(() => readUserCollectionDocument(userId, collectionName, goalId));
}

export function createGoal(userId, payload) {
  return runFirestoreRequest(async () => {
    const goal = normalizeGoal(payload);
    const ref = await createUserDocument(userId, collectionName, goal);
    return { id: ref.id, ...goal };
  });
}

export function updateGoal(userId, goalId, payload) {
  return runFirestoreRequest(async () => {
    const goal = normalizeGoal(payload);
    await updateUserCollectionDocument(userId, collectionName, goalId, goal);
    return { id: goalId, ...goal };
  });
}

export function deleteGoal(userId, goalId) {
  return runFirestoreRequest(async () => {
    await deleteUserCollectionDocument(userId, collectionName, goalId);
    return goalId;
  });
}

function normalizeGoal(payload = {}) {
  return {
    name: payload.name || payload.title || '',
    type: payload.type || 'savings',
    targetAmount: Number(payload.targetAmount || 0),
    currentAmount: Number(payload.currentAmount || 0),
    targetDate: payload.targetDate || '',
    linkedAccount: payload.linkedAccount || '',
    notes: payload.notes || '',
  };
}
