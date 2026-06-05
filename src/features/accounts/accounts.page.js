import { accounts as seedAccounts, transactions } from '../../data/mockData.js';
import { formatINR } from '../../utils/currency.js';
import { createId } from '../../utils/id.js';

const accountTypes = ['Bank account', 'Cash', 'Credit card', 'Loan', 'Investments'];

const accountState = {
  accounts: seedAccounts.map((account) => ({ ...account })),
  modal: {
    mode: null,
    accountId: null,
  },
};

function accountTransactionsCount(accountName) {
  return transactions.filter((transaction) => transaction.account === accountName).length;
}

function accountsByType(type) {
  return accountState.accounts.filter((account) => account.type === type);
}

function accountTotals() {
  return accountState.accounts.reduce(
    (totals, account) => {
      if (account.balance >= 0) totals.assets += account.balance;
      if (account.balance < 0) totals.debts += Math.abs(account.balance);
      totals.net += account.balance;
      return totals;
    },
    { assets: 0, debts: 0, net: 0 },
  );
}

function signedValue(value) {
  return Number(value || 0);
}

function formValue(account, key, fallback = '') {
  return account?.[key] ?? fallback;
}

function typeTone(type) {
  if (type === 'Credit card' || type === 'Loan') return 'debt';
  if (type === 'Investments') return 'invest';
  if (type === 'Cash') return 'cash';
  return 'bank';
}

function renderSummaryCards() {
  const totals = accountTotals();

  return `
    <section class="account-summary-grid">
      <article class="account-summary-card total">
        <span>Total balance</span>
        <strong>${formatINR(totals.net)}</strong>
        <p>Assets minus cards, loans, and other debts</p>
      </article>
      <article class="account-summary-card">
        <span>Assets</span>
        <strong>${formatINR(totals.assets)}</strong>
        <p>Bank, cash, and investments</p>
      </article>
      <article class="account-summary-card">
        <span>Debts</span>
        <strong>${formatINR(totals.debts)}</strong>
        <p>Credit cards and loans</p>
      </article>
      <article class="account-summary-card">
        <span>Accounts</span>
        <strong>${accountState.accounts.length}</strong>
        <p>Manual mock accounts</p>
      </article>
    </section>
  `;
}

function renderAccountCard(account) {
  const transactionCount = accountTransactionsCount(account.name);

  return `
    <article class="account-card tone-${typeTone(account.type)}">
      <div class="account-card-main">
        <div>
          <span>${account.institution}</span>
          <h3>${account.name}</h3>
          <p>${account.notes || 'No notes added'}</p>
        </div>
        <strong class="${account.balance < 0 ? 'is-debt' : ''}">${formatINR(account.balance)}</strong>
      </div>
      <div class="account-meta-grid">
        <div><span>Opening</span><b>${formatINR(account.openingBalance || 0)}</b></div>
        <div><span>Currency</span><b>${account.currency || 'INR'}</b></div>
        <div><span>Linked transactions</span><b>${transactionCount}</b></div>
      </div>
      <div class="account-card-footer">
        <span>${account.status || 'Manual account'}</span>
        <div class="table-actions">
          <button type="button" data-account-action="edit" data-account-id="${account.id}">Edit</button>
          <button type="button" data-account-action="delete" data-account-id="${account.id}">Delete</button>
        </div>
      </div>
    </article>
  `;
}

function renderAccountGroup(type) {
  const groupAccounts = accountsByType(type);
  const total = groupAccounts.reduce((sum, account) => sum + account.balance, 0);

  return `
    <section class="account-section">
      <div class="account-section-header">
        <div>
          <span>${type}</span>
          <h2>${formatINR(total)}</h2>
        </div>
        <p>${groupAccounts.length} account${groupAccounts.length === 1 ? '' : 's'}</p>
      </div>
      <div class="account-card-grid">
        ${
          groupAccounts.length
            ? groupAccounts.map(renderAccountCard).join('')
            : `
              <article class="account-empty-state">
                <strong>No ${type.toLowerCase()} accounts yet</strong>
                <span>Add a manual account to start tracking this group.</span>
                <button type="button" class="secondary-button" data-account-action="open-add" data-account-type="${type}">Add ${type}</button>
              </article>
            `
        }
      </div>
    </section>
  `;
}

function renderAccountModal() {
  const { mode, accountId } = accountState.modal;
  if (!mode) return '';

  const account = accountState.accounts.find((item) => item.id === accountId);

  if (mode === 'delete') {
    return `
      <div class="modal-backdrop" data-account-action="close-modal">
        <article class="transaction-modal delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
          <h2 id="delete-account-title">Delete account?</h2>
          <p>This removes the mock account from this session only. Firebase writes are not connected yet.</p>
          <div class="delete-preview">
            <strong>${account?.name || 'Selected account'}</strong>
            <span>${account?.institution || ''} · ${account ? formatINR(account.balance) : ''}</span>
          </div>
          <div class="form-actions">
            <button type="button" class="secondary-button" data-account-action="close-modal">Cancel</button>
            <button type="button" class="ghost-button" data-account-action="confirm-delete">Delete</button>
          </div>
        </article>
      </div>
    `;
  }

  const isEdit = mode === 'edit';
  const selectedType = formValue(account, 'type', accountState.modal.defaultType || 'Bank account');

  return `
    <div class="modal-backdrop" data-account-action="close-modal">
      <article class="transaction-modal account-modal" role="dialog" aria-modal="true" aria-labelledby="account-form-title">
        <div class="modal-header">
          <div>
            <p class="eyebrow">${isEdit ? 'Edit' : 'Add'} account</p>
            <h2 id="account-form-title">${isEdit ? 'Update account' : 'Create manual account'}</h2>
          </div>
          <button type="button" class="icon-button" data-account-action="close-modal" aria-label="Close account form">×</button>
        </div>
        <form class="transaction-form account-form" data-account-form>
          <input type="hidden" name="id" value="${formValue(account, 'id')}" />
          <label>Account name<input name="name" value="${formValue(account, 'name')}" placeholder="HDFC Savings" required /></label>
          <label>Account type<select name="type">
            ${accountTypes.map((type) => `<option value="${type}" ${type === selectedType ? 'selected' : ''}>${type}</option>`).join('')}
          </select></label>
          <label>Institution<input name="institution" value="${formValue(account, 'institution')}" placeholder="Bank, broker, or manual" required /></label>
          <label>Currency<select name="currency"><option value="INR" selected>INR</option></select></label>
          <label>Opening balance<input name="openingBalance" type="number" step="1" value="${formValue(account, 'openingBalance', 0)}" required /></label>
          <label>Current balance<input name="balance" type="number" step="1" value="${formValue(account, 'balance', 0)}" required /></label>
          <label class="full-span">Notes<textarea name="notes" placeholder="Purpose, repayment terms, broker notes, or account reminders">${formValue(account, 'notes')}</textarea></label>
          <div class="form-actions">
            <button type="button" class="secondary-button" data-account-action="close-modal">Cancel</button>
            <button type="submit" class="primary-action">${isEdit ? 'Save changes' : 'Add account'}</button>
          </div>
        </form>
      </article>
    </div>
  `;
}

export function renderAccountsPage() {
  return `
    <section class="accounts-page" id="accounts-page">
      <section class="page-header accounts-header">
        <div>
          <p class="eyebrow">Accounts</p>
          <h1>Everything you own and owe</h1>
          <p class="muted">Track bank balances, cash, credit cards, loans, investments, and manual INR accounts.</p>
        </div>
        <button type="button" class="primary-action" data-account-action="open-add">Add account</button>
      </section>

      ${renderSummaryCards()}
      <section class="accounts-stack">
        ${accountTypes.map(renderAccountGroup).join('')}
      </section>
      ${renderAccountModal()}
    </section>
  `;
}

function refreshAccountsPage() {
  const pageContent = document.querySelector('.page-content');
  if (pageContent && document.querySelector('#accounts-page')) {
    pageContent.innerHTML = renderAccountsPage();
  }
}

function saveAccount(form) {
  const formData = new FormData(form);
  const account = {
    id: formData.get('id') || createId('account'),
    name: formData.get('name').trim(),
    type: formData.get('type'),
    institution: formData.get('institution').trim(),
    openingBalance: signedValue(formData.get('openingBalance')),
    balance: signedValue(formData.get('balance')),
    currency: 'INR',
    status: 'Manual account',
    notes: formData.get('notes').trim(),
  };

  if (accountState.modal.mode === 'edit') {
    accountState.accounts = accountState.accounts.map((item) => (item.id === account.id ? account : item));
  } else {
    accountState.accounts = [account, ...accountState.accounts];
  }

  accountState.modal = { mode: null, accountId: null };
  refreshAccountsPage();
}

if (typeof document !== 'undefined' && !window.__atlasAccountsBound) {
  window.__atlasAccountsBound = true;

  document.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-account-action]');
    if (!actionTarget || !document.querySelector('#accounts-page')) return;

    const action = actionTarget.dataset.accountAction;
    const accountId = actionTarget.dataset.accountId;

    if (actionTarget.classList.contains('modal-backdrop') && event.target !== actionTarget) {
      return;
    }

    if (actionTarget.classList.contains('modal-backdrop')) {
      accountState.modal = { mode: null, accountId: null };
      refreshAccountsPage();
      return;
    }

    event.preventDefault();

    if (action === 'open-add') accountState.modal = { mode: 'add', accountId: null, defaultType: actionTarget.dataset.accountType };
    if (action === 'edit') accountState.modal = { mode: 'edit', accountId };
    if (action === 'delete') accountState.modal = { mode: 'delete', accountId };
    if (action === 'close-modal') accountState.modal = { mode: null, accountId: null };
    if (action === 'confirm-delete') {
      accountState.accounts = accountState.accounts.filter((account) => account.id !== accountState.modal.accountId);
      accountState.modal = { mode: null, accountId: null };
    }

    refreshAccountsPage();
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-account-form]');
    if (!form) return;

    event.preventDefault();
    saveAccount(form);
  });
}
