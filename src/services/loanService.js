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

const collectionName = userCollections.loans;

// Future use: Loans and debts will be persisted under users/{userId}/loans.
// The Loans page keeps its mock state until Firestore wiring is requested.
export function createLoansState() {
  return createFirestoreState([]);
}

export function createLoansLoadingState(data = []) {
  return createFirestoreLoadingState(data);
}

export function listLoans(userId) {
  return runFirestoreRequest(() => listUserCollectionDocuments(userId, collectionName));
}

export function readLoan(userId, loanId) {
  return runFirestoreRequest(() => readUserCollectionDocument(userId, collectionName, loanId));
}

export function createLoan(userId, payload) {
  return runFirestoreRequest(async () => {
    const loan = normalizeLoan(payload);
    const ref = await createUserDocument(userId, collectionName, loan);
    return { id: ref.id, ...loan };
  });
}

export function updateLoan(userId, loanId, payload) {
  return runFirestoreRequest(async () => {
    const loan = normalizeLoan(payload);
    await updateUserCollectionDocument(userId, collectionName, loanId, loan);
    return { id: loanId, ...loan };
  });
}

export function deleteLoan(userId, loanId) {
  return runFirestoreRequest(async () => {
    await deleteUserCollectionDocument(userId, collectionName, loanId);
    return loanId;
  });
}

function normalizeLoan(payload = {}) {
  return {
    name: payload.name || '',
    lender: payload.lender || '',
    type: payload.type || 'loan',
    principalAmount: Number(payload.principalAmount || 0),
    outstandingAmount: Number(payload.outstandingAmount || 0),
    interestRate: Number(payload.interestRate || 0),
    emiAmount: Number(payload.emiAmount || 0),
    startDate: payload.startDate || '',
    dueDate: payload.dueDate || '',
    linkedAccount: payload.linkedAccount || '',
    notes: payload.notes || '',
  };
}
