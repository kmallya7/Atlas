import { budgets } from '../data/mockData.js';

export async function getBudgets() {
  // TODO: Replace mock return with Firestore listDocuments('budgets', userId).
  return budgets;
}

export async function saveBudget(payload) {
  // TODO: Create or update a Firestore budget document.
  return payload;
}
