import { goals } from '../data/mockData.js';

export async function getGoals() {
  // TODO: Replace mock return with Firestore listDocuments('goals', userId).
  return goals;
}

export async function saveGoal(payload) {
  // TODO: Create or update a Firestore savings or debt payoff goal.
  return payload;
}
