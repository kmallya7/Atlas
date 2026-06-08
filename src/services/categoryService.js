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

const collectionName = userCollections.categories;

// Future use: Settings category management will call these functions after mock category state is retired.
// Categories live at users/{userId}/categories and can be shared by transactions, budgets, and reports.
export function createCategoriesState() {
  return createFirestoreState([]);
}

export function createCategoriesLoadingState(data = []) {
  return createFirestoreLoadingState(data);
}

export function listCategories(userId) {
  return runFirestoreRequest(() => listUserCollectionDocuments(userId, collectionName));
}

export function readCategory(userId, categoryId) {
  return runFirestoreRequest(() => readUserCollectionDocument(userId, collectionName, categoryId));
}

export function createCategory(userId, payload) {
  return runFirestoreRequest(async () => {
    const category = normalizeCategory(payload);
    const ref = await createUserDocument(userId, collectionName, category);
    return { id: ref.id, ...category };
  });
}

export function updateCategory(userId, categoryId, payload) {
  return runFirestoreRequest(async () => {
    const category = normalizeCategory(payload);
    await updateUserCollectionDocument(userId, collectionName, categoryId, category);
    return { id: categoryId, ...category };
  });
}

export function deleteCategory(userId, categoryId) {
  return runFirestoreRequest(async () => {
    await deleteUserCollectionDocument(userId, collectionName, categoryId);
    return categoryId;
  });
}

function normalizeCategory(payload = {}) {
  return {
    name: payload.name || '',
    type: payload.type || 'expense',
    description: payload.description || '',
    color: payload.color || '',
    isActive: payload.isActive ?? true,
  };
}
