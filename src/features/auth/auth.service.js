import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase.js';

const listeners = new Set();

let authState = {
  status: 'loading',
  user: null,
  error: '',
  pendingAction: null,
};

function toAuthUser(user) {
  if (!user) return null;

  return {
    uid: user.uid,
    name: user.displayName || 'Atlas user',
    email: user.email || '',
    avatarUrl: user.photoURL || '',
  };
}

function setAuthState(nextState) {
  authState = { ...authState, ...nextState };
  listeners.forEach((listener) => listener(getAuthState()));
}

export function getAuthState() {
  return { ...authState, user: authState.user ? { ...authState.user } : null };
}

export function subscribeAuth(listener) {
  listeners.add(listener);
  listener(getAuthState());

  return () => listeners.delete(listener);
}

export function clearAuthError() {
  if (!authState.error) return;
  setAuthState({ error: '' });
}

export async function signInWithGoogle() {
  setAuthState({ error: '', pendingAction: 'sign-in' });

  try {
    const result = await signInWithPopup(auth, googleProvider);
    setAuthState({
      status: 'authenticated',
      user: toAuthUser(result.user),
      error: '',
      pendingAction: null,
    });
    return getAuthState();
  } catch (error) {
    setAuthState({
      status: 'unauthenticated',
      user: null,
      error: friendlyAuthError(error),
      pendingAction: null,
    });
    return getAuthState();
  }
}

export async function logout() {
  setAuthState({ error: '', pendingAction: 'sign-out' });

  try {
    await signOut(auth);
    setAuthState({
      status: 'unauthenticated',
      user: null,
      error: '',
      pendingAction: null,
    });
  } catch (error) {
    setAuthState({
      error: friendlyAuthError(error),
      pendingAction: null,
    });
  }

  return getAuthState();
}

function friendlyAuthError(error) {
  if (error?.code === 'auth/popup-closed-by-user') {
    return 'Google sign-in was closed before it finished. Try again when you are ready.';
  }

  if (error?.code === 'auth/popup-blocked') {
    return 'Your browser blocked the Google sign-in popup. Allow popups for Atlas and try again.';
  }

  if (error?.code === 'auth/cancelled-popup-request') {
    return 'Another sign-in window is already open. Finish that one or try again.';
  }

  return 'We could not complete Google sign-in. Please try again.';
}

onAuthStateChanged(
  auth,
  (user) => {
    setAuthState({
      status: user ? 'authenticated' : 'unauthenticated',
      user: toAuthUser(user),
      error: '',
      pendingAction: null,
    });
  },
  (error) => {
    setAuthState({
      status: 'unauthenticated',
      user: null,
      error: friendlyAuthError(error),
      pendingAction: null,
    });
  },
);
