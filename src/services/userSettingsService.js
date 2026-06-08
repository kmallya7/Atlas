import {
  createFirestoreLoadingState,
  createFirestoreState,
  createUserDocument,
  deleteUserCollectionDocument,
  ensureUserDocument,
  listUserCollectionDocuments,
  readUserCollectionDocument,
  readUserDocument,
  runFirestoreRequest,
  updateUserCollectionDocument,
  userCollections,
} from './firestore.service.js';

const collectionName = userCollections.settings;

// Future use: Settings page preferences will call these functions when mock settings become persisted.
// The root users/{userId} document stores profile metadata; users/{userId}/settings stores preference documents.
export function createUserSettingsState() {
  return createFirestoreState([]);
}

export function createUserSettingsLoadingState(data = []) {
  return createFirestoreLoadingState(data);
}

export function ensureUserProfile(userId, profile) {
  return runFirestoreRequest(() => ensureUserDocument(userId, normalizeProfile(profile)));
}

export function readUserProfile(userId) {
  return runFirestoreRequest(() => readUserDocument(userId));
}

export function listUserSettings(userId) {
  return runFirestoreRequest(() => listUserCollectionDocuments(userId, collectionName));
}

export function readUserSetting(userId, settingId) {
  return runFirestoreRequest(() => readUserCollectionDocument(userId, collectionName, settingId));
}

export function createUserSetting(userId, payload) {
  return runFirestoreRequest(async () => {
    const settings = normalizeSettings(payload);
    const ref = await createUserDocument(userId, collectionName, settings);
    return { id: ref.id, ...settings };
  });
}

export function updateUserSetting(userId, settingId, payload) {
  return runFirestoreRequest(async () => {
    const settings = normalizeSettings(payload);
    await updateUserCollectionDocument(userId, collectionName, settingId, settings);
    return { id: settingId, ...settings };
  });
}

export function deleteUserSetting(userId, settingId) {
  return runFirestoreRequest(async () => {
    await deleteUserCollectionDocument(userId, collectionName, settingId);
    return settingId;
  });
}

function normalizeProfile(profile = {}) {
  return {
    name: profile.name || '',
    email: profile.email || '',
    avatarUrl: profile.avatarUrl || '',
    currency: profile.currency || 'INR',
  };
}

function normalizeSettings(payload = {}) {
  return {
    key: payload.key || 'preferences',
    theme: payload.theme || 'System default',
    defaultAccount: payload.defaultAccount || '',
    defaultTransactionType: payload.defaultTransactionType || 'Expense',
    monthStartDay: Number(payload.monthStartDay || 1),
    showInactiveAccounts: payload.showInactiveAccounts ?? false,
    defaultCashAccount: payload.defaultCashAccount || '',
  };
}
