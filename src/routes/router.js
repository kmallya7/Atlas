import { renderAuthLoadingScreen, renderLoginScreen } from '../components/authScreen.js';
import { createLayout } from '../components/layout.js';
import { clearAuthError, getAuthState, logout, signInWithGoogle, subscribeAuth } from '../features/auth/auth.service.js';
import { renderAccountsPage } from '../features/accounts/accounts.page.js';
import { renderBudgetsPage } from '../features/budgets/budgets.page.js';
import { renderDashboard } from '../features/dashboard/dashboard.page.js';
import { renderGoalsPage } from '../features/goals/goals.page.js';
import { renderLoansPage } from '../features/loans/loans.page.js';
import { renderReportsPage } from '../features/reports/reports.page.js';
import { renderSettingsPage } from '../features/settings/settings.page.js';
import { renderTransactionsPage } from '../features/transactions/transactions.page.js';

const routes = {
  '/': renderDashboard,
  '/dashboard': renderDashboard,
  '/accounts': renderAccountsPage,
  '/transactions': renderTransactionsPage,
  '/budgets': renderBudgetsPage,
  '/goals': renderGoalsPage,
  '/loans': renderLoansPage,
  '/reports': renderReportsPage,
  '/settings': renderSettingsPage,
};

let previousAuthState = getAuthState();
let authSubscription = null;

function currentPath() {
  return window.location.hash.replace('#', '') || window.location.pathname || '/';
}

export function renderApp() {
  const app = document.querySelector('#app');
  const authState = getAuthState();

  if (!app) return;

  if (authState.status === 'loading') {
    app.innerHTML = renderAuthLoadingScreen();
    return;
  }

  if (!authState.user) {
    app.innerHTML = renderLoginScreen(authState);
    return;
  }

  const path = currentPath();
  const page = routes[path] || renderDashboard;

  app.innerHTML = createLayout(page({ user: authState.user }), { user: authState.user });
  window.scrollTo(0, 0);
}

export function initRouter() {
  if (!authSubscription) {
    authSubscription = subscribeAuth((authState) => {
      const completedInteractiveLogin = previousAuthState.status === 'unauthenticated' && authState.status === 'authenticated';

      previousAuthState = authState;

      if (completedInteractiveLogin && window.location.hash !== '#/dashboard') {
        window.location.hash = '#/dashboard';
        return;
      }

      renderApp();
    });
  }

  document.addEventListener('click', (event) => {
    const authAction = event.target.closest('[data-auth-action]');
    if (authAction) {
      event.preventDefault();
      handleAuthAction(authAction.dataset.authAction);
      return;
    }

    const link = event.target.closest('a[data-link]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href?.startsWith('#/')) return;

    event.preventDefault();
    window.location.hash = href;
    renderApp();
  });

  window.addEventListener('popstate', renderApp);
  window.addEventListener('hashchange', renderApp);
}

async function handleAuthAction(action) {
  if (action === 'sign-in') {
    clearAuthError();
    const nextAuthState = await signInWithGoogle();

    if (nextAuthState.user) {
      window.location.hash = '#/dashboard';
      return;
    }

    renderApp();
  }

  if (action === 'sign-out') {
    await logout();
    renderApp();
  }
}
