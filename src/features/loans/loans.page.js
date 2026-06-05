import { accounts, loansDebts as seedLoansDebts } from '../../data/mockData.js';
import { formatINR } from '../../utils/currency.js';
import { createId } from '../../utils/id.js';

const debtTypes = ['loan', 'credit card', 'personal debt', 'gold loan', 'business loan', 'other'];
const today = new Date('2026-06-04T00:00:00');

const loanState = {
  loansDebts: seedLoansDebts.map((debt) => ({ ...debt })),
  modal: {
    mode: null,
    debtId: null,
  },
};

function titleCase(value) {
  return value
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatDate(value) {
  if (!value) return 'No due date';

  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function repaymentPercent(debt) {
  const repaid = Math.max(debt.principalAmount - debt.outstandingAmount, 0);
  return Math.round((repaid / Math.max(debt.principalAmount, 1)) * 100);
}

function debtStatus(debt) {
  if (debt.outstandingAmount <= 0) return 'paid off';
  if (new Date(`${debt.dueDate}T00:00:00`) < today) return 'overdue';
  return 'active';
}

function statusLabel(status) {
  if (status === 'paid off') return 'Paid off';
  if (status === 'overdue') return 'Overdue';
  return 'Active';
}

function statusClass(status) {
  return status.replace(' ', '-');
}

function totals() {
  return loanState.loansDebts.reduce(
    (summary, debt) => {
      summary.principal += debt.principalAmount;
      summary.outstanding += Math.max(debt.outstandingAmount, 0);
      if (debt.outstandingAmount > 0) summary.emi += debt.emiAmount;
      return summary;
    },
    { principal: 0, outstanding: 0, emi: 0 },
  );
}

function upcomingDebts() {
  return loanState.loansDebts
    .filter((debt) => debt.outstandingAmount > 0)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

function nextDue() {
  return upcomingDebts()[0];
}

function formValue(debt, key, fallback = '') {
  return debt?.[key] ?? fallback;
}

function renderOverview() {
  const summary = totals();
  const due = nextDue();
  const progress = Math.round(((summary.principal - summary.outstanding) / Math.max(summary.principal, 1)) * 100);

  return `
    <section class="loan-overview-grid">
      <article class="loan-overview-card total">
        <span>Total outstanding</span>
        <strong>${formatINR(summary.outstanding)}</strong>
        <p>Loans, cards, personal debts, and business debt still payable</p>
      </article>
      <article class="loan-overview-card">
        <span>Total monthly EMI</span>
        <strong>${formatINR(summary.emi)}</strong>
        <p>Across active debts</p>
      </article>
      <article class="loan-overview-card">
        <span>Next due amount</span>
        <strong>${due ? formatINR(due.emiAmount) : formatINR(0)}</strong>
        <p>${due ? `${due.name} · ${formatDate(due.dueDate)}` : 'No active dues'}</p>
      </article>
      <article class="loan-overview-card">
        <span>Debt payoff progress</span>
        <strong>${progress}%</strong>
        <div class="loan-overview-track"><span style="width: ${Math.min(progress, 100)}%"></span></div>
      </article>
    </section>
  `;
}

function renderUpcomingDues() {
  const dues = upcomingDebts().slice(0, 4);

  return `
    <section class="loan-dues-section">
      <div class="loan-section-header">
        <div>
          <span>Upcoming due dates</span>
          <h2>${dues.length} scheduled payments</h2>
        </div>
        <p>Sorted by due date</p>
      </div>
      <div class="loan-due-list">
        ${
          dues.length
            ? dues
                .map(
                  (debt) => `
                    <article class="loan-due-row status-${statusClass(debtStatus(debt))}">
                      <div>
                        <strong>${debt.name}</strong>
                        <span>${debt.lender} · ${formatDate(debt.dueDate)}</span>
                      </div>
                      <b>${formatINR(debt.emiAmount)}</b>
                    </article>
                  `,
                )
                .join('')
            : `
              <article class="loan-empty-state compact">
                <strong>No upcoming dues</strong>
                <span>Paid-off debts and zero-EMI loans do not appear here.</span>
              </article>
            `
        }
      </div>
    </section>
  `;
}

function renderDebtCard(debt) {
  const status = debtStatus(debt);
  const progress = repaymentPercent(debt);
  const repaid = Math.max(debt.principalAmount - debt.outstandingAmount, 0);

  return `
    <article class="loan-card status-${statusClass(status)}">
      <div class="loan-card-header">
        <div>
          <span>${titleCase(debt.type)}</span>
          <h3>${debt.name}</h3>
          <p>${debt.notes || 'No notes added'}</p>
        </div>
        <mark class="loan-status ${statusClass(status)}">${statusLabel(status)}</mark>
      </div>
      <div class="loan-progress-row">
        <strong>${formatINR(debt.outstandingAmount)}</strong>
        <span>${progress}% repaid · ${formatINR(repaid)} paid</span>
      </div>
      <div class="loan-progress-track">
        <span style="width: ${Math.min(progress, 100)}%"></span>
      </div>
      <div class="loan-meta-grid">
        <div><span>Lender/person</span><b>${debt.lender}</b></div>
        <div><span>Interest</span><b>${debt.interestRate}%</b></div>
        <div><span>EMI</span><b>${formatINR(debt.emiAmount)}</b></div>
        <div><span>Started</span><b>${formatDate(debt.startDate)}</b></div>
        <div><span>Due date</span><b>${formatDate(debt.dueDate)}</b></div>
        <div><span>Linked account</span><b>${debt.linkedAccount || 'Unlinked'}</b></div>
      </div>
      <div class="loan-card-footer">
        <span>Principal ${formatINR(debt.principalAmount)}</span>
        <div class="table-actions">
          <button type="button" data-loan-action="edit" data-loan-id="${debt.id}">Edit</button>
          <button type="button" data-loan-action="delete" data-loan-id="${debt.id}">Delete</button>
        </div>
      </div>
    </article>
  `;
}

function renderDebtCards() {
  return `
    <section class="loans-section">
      <div class="loan-section-header">
        <div>
          <span>Loan/debt cards</span>
          <h2>${loanState.loansDebts.length} records</h2>
        </div>
        <p>Loans, credit cards, personal debt, gold loans, business loans, and other debts</p>
      </div>
      <div class="loan-type-list">
        ${debtTypes.map((type) => `<span>${titleCase(type)}</span>`).join('')}
      </div>
      <div class="loan-card-grid">
        ${
          loanState.loansDebts.length
            ? loanState.loansDebts.map(renderDebtCard).join('')
            : `
              <article class="loan-empty-state">
                <strong>No loans or debts yet</strong>
                <span>Add a loan, credit card, personal debt, gold loan, business loan, or other debt to start tracking payoff.</span>
                <button type="button" class="secondary-button" data-loan-action="open-add">Add loan/debt</button>
              </article>
            `
        }
      </div>
    </section>
  `;
}

function renderLoanModal() {
  const { mode, debtId } = loanState.modal;
  if (!mode) return '';

  const debt = loanState.loansDebts.find((item) => item.id === debtId);

  if (mode === 'delete') {
    return `
      <div class="modal-backdrop" data-loan-action="close-modal">
        <article class="transaction-modal delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-loan-title">
          <h2 id="delete-loan-title">Delete loan/debt?</h2>
          <p>This removes the mock debt from this session only. Firebase writes are not connected yet.</p>
          <div class="delete-preview">
            <strong>${debt?.name || 'Selected debt'}</strong>
            <span>${debt ? `${debt.lender} · ${formatINR(debt.outstandingAmount)}` : ''}</span>
          </div>
          <div class="form-actions">
            <button type="button" class="secondary-button" data-loan-action="close-modal">Cancel</button>
            <button type="button" class="ghost-button" data-loan-action="confirm-delete">Delete</button>
          </div>
        </article>
      </div>
    `;
  }

  const isEdit = mode === 'edit';
  const selectedType = formValue(debt, 'type', 'loan');
  const selectedAccount = formValue(debt, 'linkedAccount', accounts[0]?.name || '');

  return `
    <div class="modal-backdrop" data-loan-action="close-modal">
      <article class="transaction-modal loan-modal" role="dialog" aria-modal="true" aria-labelledby="loan-form-title">
        <div class="modal-header">
          <div>
            <p class="eyebrow">${isEdit ? 'Edit' : 'Add'} loan/debt</p>
            <h2 id="loan-form-title">${isEdit ? 'Update loan/debt' : 'Create loan/debt'}</h2>
          </div>
          <button type="button" class="icon-button" data-loan-action="close-modal" aria-label="Close loan form">×</button>
        </div>
        <form class="transaction-form loan-form" data-loan-form>
          <input type="hidden" name="id" value="${formValue(debt, 'id')}" />
          <label>Name<input name="name" value="${formValue(debt, 'name')}" placeholder="Home loan" required /></label>
          <label>Lender/person<input name="lender" value="${formValue(debt, 'lender')}" placeholder="SBI, ICICI, friend, family" required /></label>
          <label>Type<select name="type">
            ${debtTypes.map((type) => `<option value="${type}" ${type === selectedType ? 'selected' : ''}>${titleCase(type)}</option>`).join('')}
          </select></label>
          <label>Principal amount<input name="principalAmount" type="number" min="0" step="1" value="${formValue(debt, 'principalAmount', 0)}" required /></label>
          <label>Outstanding amount<input name="outstandingAmount" type="number" min="0" step="1" value="${formValue(debt, 'outstandingAmount', 0)}" required /></label>
          <label>Interest rate<input name="interestRate" type="number" min="0" step="0.01" value="${formValue(debt, 'interestRate', 0)}" required /></label>
          <label>EMI amount<input name="emiAmount" type="number" min="0" step="1" value="${formValue(debt, 'emiAmount', 0)}" required /></label>
          <label>Start date<input name="startDate" type="date" value="${formValue(debt, 'startDate', '2026-01-01')}" required /></label>
          <label>Due date<input name="dueDate" type="date" value="${formValue(debt, 'dueDate', '2026-07-05')}" required /></label>
          <label>Linked account<select name="linkedAccount">
            <option value="">Unlinked</option>
            ${accounts.map((account) => `<option value="${account.name}" ${account.name === selectedAccount ? 'selected' : ''}>${account.name}</option>`).join('')}
          </select></label>
          <label class="full-span">Notes<textarea name="notes" placeholder="Repayment strategy, collateral, reminders, or lender notes">${formValue(debt, 'notes')}</textarea></label>
          <div class="form-actions">
            <button type="button" class="secondary-button" data-loan-action="close-modal">Cancel</button>
            <button type="submit" class="primary-action">${isEdit ? 'Save changes' : 'Add loan/debt'}</button>
          </div>
        </form>
      </article>
    </div>
  `;
}

export function renderLoansPage() {
  return `
    <section class="loans-page" id="loans-page">
      <section class="page-header loans-header">
        <div>
          <p class="eyebrow">Loans and debts</p>
          <h1>Pay down balances with a plan</h1>
          <p class="muted">Track outstanding balances, EMIs, due dates, repayment progress, and linked accounts.</p>
        </div>
        <button type="button" class="primary-action" data-loan-action="open-add">Add loan/debt</button>
      </section>

      ${renderOverview()}
      ${renderUpcomingDues()}
      ${renderDebtCards()}
      ${renderLoanModal()}
    </section>
  `;
}

function refreshLoansPage() {
  const pageContent = document.querySelector('.page-content');
  if (pageContent && document.querySelector('#loans-page')) {
    pageContent.innerHTML = renderLoansPage();
  }
}

function saveLoanDebt(form) {
  const formData = new FormData(form);
  const debt = {
    id: formData.get('id') || createId('debt'),
    name: formData.get('name').trim(),
    lender: formData.get('lender').trim(),
    type: formData.get('type'),
    principalAmount: Number(formData.get('principalAmount')),
    outstandingAmount: Number(formData.get('outstandingAmount')),
    interestRate: Number(formData.get('interestRate')),
    emiAmount: Number(formData.get('emiAmount')),
    startDate: formData.get('startDate'),
    dueDate: formData.get('dueDate'),
    linkedAccount: formData.get('linkedAccount'),
    notes: formData.get('notes').trim(),
  };

  if (loanState.modal.mode === 'edit') {
    loanState.loansDebts = loanState.loansDebts.map((item) => (item.id === debt.id ? debt : item));
  } else {
    loanState.loansDebts = [debt, ...loanState.loansDebts];
  }

  loanState.modal = { mode: null, debtId: null };
  refreshLoansPage();
}

if (typeof document !== 'undefined' && !window.__atlasLoansBound) {
  window.__atlasLoansBound = true;

  document.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-loan-action]');
    if (!actionTarget || !document.querySelector('#loans-page')) return;

    const action = actionTarget.dataset.loanAction;
    const debtId = actionTarget.dataset.loanId;

    if (actionTarget.classList.contains('modal-backdrop') && event.target !== actionTarget) {
      return;
    }

    if (actionTarget.classList.contains('modal-backdrop')) {
      loanState.modal = { mode: null, debtId: null };
      refreshLoansPage();
      return;
    }

    event.preventDefault();

    if (action === 'open-add') loanState.modal = { mode: 'add', debtId: null };
    if (action === 'edit') loanState.modal = { mode: 'edit', debtId };
    if (action === 'delete') loanState.modal = { mode: 'delete', debtId };
    if (action === 'close-modal') loanState.modal = { mode: null, debtId: null };
    if (action === 'confirm-delete') {
      loanState.loansDebts = loanState.loansDebts.filter((debt) => debt.id !== loanState.modal.debtId);
      loanState.modal = { mode: null, debtId: null };
    }

    refreshLoansPage();
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-loan-form]');
    if (!form) return;

    event.preventDefault();
    saveLoanDebt(form);
  });
}
