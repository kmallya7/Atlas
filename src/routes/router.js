import { createLayout } from '../components/layout.js';
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

function currentPath() {
  return window.location.hash.replace('#', '') || window.location.pathname || '/';
}

export function renderApp() {
  const app = document.querySelector('#app');
  const path = currentPath();
  const page = routes[path] || renderDashboard;

  app.innerHTML = createLayout(page());
  window.scrollTo(0, 0);
}

export function initRouter() {
  document.addEventListener('click', (event) => {
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
