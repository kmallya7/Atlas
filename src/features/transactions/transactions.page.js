import { transactionTable } from '../../components/transactionTable.js';
import { accounts, transactions as seedTransactions } from '../../data/mockData.js';
import { formatINR } from '../../utils/currency.js';
import { createId } from '../../utils/id.js';

const transactionState = {
  transactions: seedTransactions.map((transaction) => ({ ...transaction })),
  filters: {
    search: '',
    type: 'all',
    category: 'all',
    account: 'all',
    startDate: '',
    endDate: '',
  },
  modal: {
    mode: null,
    transactionId: null,
  },
};

function unique(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function formatDisplayDate(isoDate) {
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short' }).format(new Date(`${isoDate}T00:00:00`));
}

function formatTransactionAmount(type, amountValue) {
  const formatted = formatINR(Number(amountValue || 0));
  if (type === 'income') return `+${formatted}`;
  if (type === 'expense') return `-${formatted}`;
  return formatted;
}

function getFilteredTransactions() {
  const { search, type, category, account, startDate, endDate } = transactionState.filters;
  const query = search.trim().toLowerCase();

  return transactionState.transactions.filter((transaction) => {
    const matchesSearch =
      !query ||
      [transaction.merchant, transaction.category, transaction.account, transaction.notes]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    const matchesType = type === 'all' || transaction.type === type;
    const matchesCategory = category === 'all' || transaction.category === category;
    const matchesAccount = account === 'all' || transaction.account === account;
    const matchesStart = !startDate || transaction.isoDate >= startDate;
    const matchesEnd = !endDate || transaction.isoDate <= endDate;

    return matchesSearch && matchesType && matchesCategory && matchesAccount && matchesStart && matchesEnd;
  });
}

function transactionTotals(transactions) {
  return transactions.reduce(
    (totals, transaction) => {
      if (transaction.type === 'income') totals.income += transaction.amountValue;
      if (transaction.type === 'expense') totals.expense += transaction.amountValue;
      if (transaction.type === 'transfer') totals.transfer += transaction.amountValue;
      return totals;
    },
    { income: 0, expense: 0, transfer: 0 },
  );
}

function options(values, selectedValue, allLabel) {
  return [`<option value="all">${allLabel}</option>`, ...values.map((value) => `<option value="${value}" ${value === selectedValue ? 'selected' : ''}>${value}</option>`)].join('');
}

function renderFilters(categories, accountNames) {
  const { search, type, category, account, startDate, endDate } = transactionState.filters;

  return `
    <section class="transactions-toolbar">
      <label class="transactions-search">
        <span>Search</span>
        <input data-transaction-filter="search" type="search" value="${search}" placeholder="Merchant, category, account, notes" />
      </label>
      <label>
        <span>Type</span>
        <select data-transaction-filter="type">
          <option value="all">All types</option>
          <option value="income" ${type === 'income' ? 'selected' : ''}>Income</option>
          <option value="expense" ${type === 'expense' ? 'selected' : ''}>Expense</option>
          <option value="transfer" ${type === 'transfer' ? 'selected' : ''}>Transfer</option>
        </select>
      </label>
      <label>
        <span>Category</span>
        <select data-transaction-filter="category">${options(categories, category, 'All categories')}</select>
      </label>
      <label>
        <span>Account</span>
        <select data-transaction-filter="account">${options(accountNames, account, 'All accounts')}</select>
      </label>
      <label>
        <span>From</span>
        <input data-transaction-filter="startDate" type="date" value="${startDate}" />
      </label>
      <label>
        <span>To</span>
        <input data-transaction-filter="endDate" type="date" value="${endDate}" />
      </label>
      <button type="button" class="ghost-button" data-transaction-action="clear-filters">Clear</button>
    </section>
  `;
}

function formValue(transaction, key, fallback = '') {
  return transaction?.[key] ?? fallback;
}

function renderTransactionModal(categories, accountNames) {
  const { mode, transactionId } = transactionState.modal;
  if (!mode) return '';

  const transaction = transactionState.transactions.find((item) => item.id === transactionId);

  if (mode === 'delete') {
    return `
      <div class="modal-backdrop" data-transaction-action="close-modal">
        <article class="transaction-modal delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-transaction-title">
          <h2 id="delete-transaction-title">Delete transaction?</h2>
          <p>This removes the mock transaction from this session only. Firestore writes are not connected yet.</p>
          <div class="delete-preview">
            <strong>${transaction?.merchant || 'Selected transaction'}</strong>
            <span>${transaction?.amount || ''} · ${transaction?.date || ''}</span>
          </div>
          <div class="form-actions">
            <button type="button" class="secondary-button" data-transaction-action="close-modal">Cancel</button>
            <button type="button" class="ghost-button" data-transaction-action="confirm-delete">Delete</button>
          </div>
        </article>
      </div>
    `;
  }

  const isEdit = mode === 'edit';
  const currentType = formValue(transaction, 'type', 'expense');
  const currentCategory = formValue(transaction, 'category', categories[0] || 'Groceries');
  const currentAccount = formValue(transaction, 'account', accountNames[0] || 'HDFC Salary Account');

  return `
    <div class="modal-backdrop" data-transaction-action="close-modal">
      <article class="transaction-modal" role="dialog" aria-modal="true" aria-labelledby="transaction-form-title">
        <div class="modal-header">
          <div>
            <p class="eyebrow">${isEdit ? 'Edit' : 'Add'} transaction</p>
            <h2 id="transaction-form-title">${isEdit ? 'Update transaction' : 'Create transaction'}</h2>
          </div>
          <button type="button" class="icon-button" data-transaction-action="close-modal" aria-label="Close transaction form">×</button>
        </div>
        <form class="transaction-form" data-transaction-form>
          <input type="hidden" name="id" value="${formValue(transaction, 'id')}" />
          <label>Date<input name="isoDate" type="date" value="${formValue(transaction, 'isoDate', '2026-06-04')}" required /></label>
          <label>Merchant<input name="merchant" value="${formValue(transaction, 'merchant')}" placeholder="Merchant or payer" required /></label>
          <label>Category<select name="category">${categories.map((item) => `<option value="${item}" ${item === currentCategory ? 'selected' : ''}>${item}</option>`).join('')}</select></label>
          <label>Account<select name="account">${accountNames.map((item) => `<option value="${item}" ${item === currentAccount ? 'selected' : ''}>${item}</option>`).join('')}</select></label>
          <label>Type<select name="type">
            <option value="expense" ${currentType === 'expense' ? 'selected' : ''}>Expense</option>
            <option value="income" ${currentType === 'income' ? 'selected' : ''}>Income</option>
            <option value="transfer" ${currentType === 'transfer' ? 'selected' : ''}>Transfer</option>
          </select></label>
          <label>Amount<input name="amountValue" type="number" min="0" step="1" value="${formValue(transaction, 'amountValue', 0)}" required /></label>
          <label class="full-span">Notes<textarea name="notes" placeholder="Add context, split details, or reimbursement notes">${formValue(transaction, 'notes')}</textarea></label>
          <div class="form-actions">
            <button type="button" class="secondary-button" data-transaction-action="close-modal">Cancel</button>
            <button type="submit" class="primary-action">${isEdit ? 'Save changes' : 'Add transaction'}</button>
          </div>
        </form>
      </article>
    </div>
  `;
}

function renderSummaryCards(filteredTransactions) {
  const totals = transactionTotals(filteredTransactions);

  return `
    <section class="transaction-summary-grid">
      <article><span>Income</span><strong>${formatINR(totals.income)}</strong></article>
      <article><span>Expenses</span><strong>${formatINR(totals.expense)}</strong></article>
      <article><span>Transfers</span><strong>${formatINR(totals.transfer)}</strong></article>
      <article><span>Results</span><strong>${filteredTransactions.length}</strong></article>
    </section>
  `;
}

export function renderTransactionsPage() {
  const categories = unique(transactionState.transactions.map((transaction) => transaction.category));
  const accountNames = unique([...accounts.map((account) => account.name), ...transactionState.transactions.map((transaction) => transaction.account)]);
  const filteredTransactions = getFilteredTransactions();

  return `
    <section class="transactions-page" id="transactions-page">
      <section class="page-header transactions-header">
        <div>
          <p class="eyebrow">Transactions</p>
          <h1>Review every rupee</h1>
          <p class="muted">Search, filter, add, edit, and delete mock transactions before Firestore CRUD is connected.</p>
        </div>
        <button type="button" class="primary-action" data-transaction-action="open-add">Add transaction</button>
      </section>

      ${renderSummaryCards(filteredTransactions)}
      ${renderFilters(categories, accountNames)}
      ${transactionTable(filteredTransactions, {
        showActions: true,
        title: 'Transactions',
        description: 'Mock records with date, merchant, category, account, type, amount, and notes',
      })}
      ${renderTransactionModal(categories, accountNames)}
    </section>
  `;
}

function refreshTransactionsPage(focusFilter = null) {
  const activeElement = document.activeElement;
  const activeFilter = focusFilter || activeElement?.dataset?.transactionFilter;
  const selectionStart = typeof activeElement?.selectionStart === 'number' ? activeElement.selectionStart : null;
  const pageContent = document.querySelector('.page-content');
  if (pageContent && document.querySelector('#transactions-page')) {
    pageContent.innerHTML = renderTransactionsPage();
    if (activeFilter) {
      const nextField = document.querySelector(`[data-transaction-filter="${activeFilter}"]`);
      nextField?.focus();
      if (selectionStart !== null && typeof nextField?.setSelectionRange === 'function') {
        nextField.setSelectionRange(selectionStart, selectionStart);
      }
    }
  }
}

function resetFilters() {
  transactionState.filters = {
    search: '',
    type: 'all',
    category: 'all',
    account: 'all',
    startDate: '',
    endDate: '',
  };
}

function saveTransaction(form) {
  const formData = new FormData(form);
  const type = formData.get('type');
  const amountValue = Number(formData.get('amountValue'));
  const isoDate = formData.get('isoDate');
  const transaction = {
    id: formData.get('id') || createId('transaction'),
    merchant: formData.get('merchant').trim(),
    category: formData.get('category'),
    account: formData.get('account'),
    type,
    amountValue,
    amount: formatTransactionAmount(type, amountValue),
    isoDate,
    date: formatDisplayDate(isoDate),
    notes: formData.get('notes').trim(),
  };

  if (transactionState.modal.mode === 'edit') {
    transactionState.transactions = transactionState.transactions.map((item) => (item.id === transaction.id ? transaction : item));
  } else {
    transactionState.transactions = [transaction, ...transactionState.transactions];
  }

  transactionState.modal = { mode: null, transactionId: null };
  refreshTransactionsPage();
}

if (typeof document !== 'undefined' && !window.__atlasTransactionsBound) {
  window.__atlasTransactionsBound = true;

  document.addEventListener('input', (event) => {
    const field = event.target.closest('[data-transaction-filter]');
    if (!field || !document.querySelector('#transactions-page')) return;

    transactionState.filters[field.dataset.transactionFilter] = field.value;
    refreshTransactionsPage(field.dataset.transactionFilter);
  });

  document.addEventListener('change', (event) => {
    const field = event.target.closest('[data-transaction-filter]');
    if (!field || !document.querySelector('#transactions-page')) return;

    transactionState.filters[field.dataset.transactionFilter] = field.value;
    refreshTransactionsPage();
  });

  document.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-transaction-action]');
    if (!actionTarget || !document.querySelector('#transactions-page')) return;

    const action = actionTarget.dataset.transactionAction;
    const transactionId = actionTarget.dataset.transactionId;

    if (actionTarget.classList.contains('modal-backdrop') && event.target !== actionTarget) {
      return;
    }

    if (actionTarget.classList.contains('modal-backdrop')) {
      transactionState.modal = { mode: null, transactionId: null };
      refreshTransactionsPage();
      return;
    }

    event.preventDefault();

    if (action === 'open-add') transactionState.modal = { mode: 'add', transactionId: null };
    if (action === 'edit') transactionState.modal = { mode: 'edit', transactionId };
    if (action === 'delete') transactionState.modal = { mode: 'delete', transactionId };
    if (action === 'close-modal') transactionState.modal = { mode: null, transactionId: null };
    if (action === 'clear-filters') resetFilters();
    if (action === 'confirm-delete') {
      transactionState.transactions = transactionState.transactions.filter((transaction) => transaction.id !== transactionState.modal.transactionId);
      transactionState.modal = { mode: null, transactionId: null };
    }

    refreshTransactionsPage();
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-transaction-form]');
    if (!form) return;

    event.preventDefault();
    saveTransaction(form);
  });
}
