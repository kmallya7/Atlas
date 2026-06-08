import { icon } from './icons.js';

function renderAuthError(message) {
  if (!message) return '';

  return `
    <div class="auth-message error" role="alert">
      ${message}
    </div>
  `;
}

export function renderAuthLoadingScreen() {
  return `
    <main class="auth-shell">
      <section class="auth-card" aria-live="polite">
        <div class="brand auth-brand">
          <span class="brand-mark">A</span>
          <span>
            <strong>Atlas</strong>
            <small>Personal finance</small>
          </span>
        </div>
        <div class="auth-loader" aria-hidden="true"></div>
        <h1>Getting Atlas ready</h1>
        <p>Checking your sign-in state so your mock workspace opens cleanly.</p>
      </section>
    </main>
  `;
}

export function renderLoginScreen(authState) {
  const isSigningIn = authState.pendingAction === 'sign-in';

  return `
    <main class="auth-shell">
      <section class="auth-card">
        <div class="brand auth-brand">
          <span class="brand-mark">A</span>
          <span>
            <strong>Atlas</strong>
            <small>Personal finance</small>
          </span>
        </div>
        <div class="auth-copy">
          <p class="eyebrow">Google sign-in</p>
          <h1>Your financial map is ready</h1>
          <p>Sign in to open Atlas. Dashboard, reports, settings, and the rest of the app still use mock data after login.</p>
        </div>
        ${renderAuthError(authState.error)}
        <button class="primary-action auth-google-button" type="button" data-auth-action="sign-in" ${isSigningIn ? 'disabled' : ''}>
          ${icon('google')}
          <span>${isSigningIn ? 'Opening Google...' : 'Continue with Google'}</span>
        </button>
      </section>
    </main>
  `;
}
