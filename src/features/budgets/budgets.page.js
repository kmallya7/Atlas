import { budgets as seedBudgets } from '../../data/mockData.js';
import { formatINR } from '../../utils/currency.js';
import { createId } from '../../utils/id.js';

const budgetGroups = ['essentials', 'lifestyle', 'family', 'business', 'savings'];

const budgetState = {
  budgets: seedBudgets.map((budget) => ({ ...budget })),
  modal: {
    mode: null,
    budgetId: null,
  },
};

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatPeriod(value) {
  if (!value) return 'June 2026';
  if (!value.includes('-')) return value;

  return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(`${value}-01T00:00:00`));
}

function periodInputValue(period) {
  const date = new Date(`${period || 'June 2026'} 01`);
  if (Number.isNaN(date.getTime())) return '2026-06';

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function budgetPercent(budget) {
  return Math.round((budget.spentAmount / Math.max(budget.monthlyLimit, 1)) * 100);
}

function budgetStatus(budget) {
  const percent = budgetPercent(budget);
  if (percent > 100) return 'exceeded';
  if (percent >= 80) return 'warning';
  return 'safe';
}

function statusLabel(status) {
  if (status === 'safe') return 'Safe';
  if (status === 'warning') return 'Warning';
  return 'Exceeded';
}

function totals() {
  return budgetState.budgets.reduce(
    (summary, budget) => {
      summary.limit += budget.monthlyLimit;
      summary.spent += budget.spentAmount;
      return summary;
    },
    { limit: 0, spent: 0 },
  );
}

function budgetHealth() {
  const statusCounts = budgetState.budgets.reduce(
    (counts, budget) => {
      counts[budgetStatus(budget)] += 1;
      return counts;
    },
    { safe: 0, warning: 0, exceeded: 0 },
  );

  if (statusCounts.exceeded) return { label: 'Needs attention', status: 'exceeded' };
  if (statusCounts.warning) return { label: 'Watch closely', status: 'warning' };
  return { label: 'Healthy', status: 'safe' };
}

function budgetViewModel(budget) {
  const percent = budgetPercent(budget);
  const status = budgetStatus(budget);
  const remaining = budget.monthlyLimit - budget.spentAmount;

  return {
    ...budget,
    percent,
    status,
    remaining,
    current: formatINR(budget.spentAmount),
    target: formatINR(budget.monthlyLimit),
  };
}

function formValue(budget, key, fallback = '') {
  return budget?.[key] ?? fallback;
}

function renderOverview() {
  const summary = totals();
  const remaining = summary.limit - summary.spent;
  const health = budgetHealth();
  const percent = Math.round((summary.spent / Math.max(summary.limit, 1)) * 100);

  return `
    <section class="budget-overview-grid">
      <article class="budget-overview-card total">
        <span>Total budget</span>
        <strong>${formatINR(summary.limit)}</strong>
        <p>Monthly planned spend across all budget groups</p>
      </article>
      <article class="budget-overview-card">
        <span>Total spent</span>
        <strong>${formatINR(summary.spent)}</strong>
        <p>${percent}% of budget used</p>
      </article>
      <article class="budget-overview-card">
        <span>Remaining</span>
        <strong class="${remaining < 0 ? 'is-exceeded' : ''}">${formatINR(remaining)}</strong>
        <p>${remaining < 0 ? 'Over monthly plan' : 'Available for the period'}</p>
      </article>
      <article class="budget-overview-card">
        <span>Budget health</span>
        <strong><mark class="budget-status ${health.status}">${health.label}</mark></strong>
        <p>Safe, warning, and exceeded categories</p>
      </article>
    </section>
  `;
}

function renderBudgetCard(budget) {
  const view = budgetViewModel(budget);

  return `
    <article class="budget-card status-${view.status}">
      <div class="budget-card-header">
        <div>
          <span>${titleCase(view.group)}</span>
          <h3>${view.category}</h3>
          <p>${view.notes || 'No notes added'}</p>
        </div>
        <mark class="budget-status ${view.status}">${statusLabel(view.status)}</mark>
      </div>
      <div class="budget-progress-row">
        <strong>${view.current}</strong>
        <span>${view.percent}% of ${view.target}</span>
      </div>
      <div class="budget-progress-track">
        <span style="width: ${Math.min(view.percent, 100)}%"></span>
      </div>
      <div class="budget-card-footer">
        <span>${view.budgetPeriod} · ${view.remaining >= 0 ? `${formatINR(view.remaining)} left` : `${formatINR(Math.abs(view.remaining))} over`}</span>
        <div class="table-actions">
          <button type="button" data-budget-action="edit" data-budget-id="${view.id}">Edit</button>
          <button type="button" data-budget-action="delete" data-budget-id="${view.id}">Delete</button>
        </div>
      </div>
    </article>
  `;
}

function renderBudgetGroup(group) {
  const groupBudgets = budgetState.budgets.filter((budget) => budget.group === group);
  const groupTotal = groupBudgets.reduce((sum, budget) => sum + budget.monthlyLimit, 0);
  const groupSpent = groupBudgets.reduce((sum, budget) => sum + budget.spentAmount, 0);

  return `
    <section class="budget-section">
      <div class="budget-section-header">
        <div>
          <span>${titleCase(group)}</span>
          <h2>${formatINR(groupSpent)} spent</h2>
        </div>
        <p>${formatINR(groupTotal)} budgeted</p>
      </div>
      <div class="budget-card-grid">
        ${
          groupBudgets.length
            ? groupBudgets.map(renderBudgetCard).join('')
            : `
              <article class="budget-empty-state">
                <strong>No ${group} budgets yet</strong>
                <span>Add a category budget to track this group.</span>
                <button type="button" class="secondary-button" data-budget-action="open-add" data-budget-group="${group}">Add ${titleCase(group)} budget</button>
              </article>
            `
        }
      </div>
    </section>
  `;
}

function renderBudgetModal() {
  const { mode, budgetId } = budgetState.modal;
  if (!mode) return '';

  const budget = budgetState.budgets.find((item) => item.id === budgetId);

  if (mode === 'delete') {
    return `
      <div class="modal-backdrop" data-budget-action="close-modal">
        <article class="transaction-modal delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-budget-title">
          <h2 id="delete-budget-title">Delete budget?</h2>
          <p>This removes the mock budget from this session only. Firebase writes are not connected yet.</p>
          <div class="delete-preview">
            <strong>${budget?.category || 'Selected budget'}</strong>
            <span>${budget?.budgetPeriod || ''} · ${budget ? formatINR(budget.monthlyLimit) : ''}</span>
          </div>
          <div class="form-actions">
            <button type="button" class="secondary-button" data-budget-action="close-modal">Cancel</button>
            <button type="button" class="ghost-button" data-budget-action="confirm-delete">Delete</button>
          </div>
        </article>
      </div>
    `;
  }

  const isEdit = mode === 'edit';
  const selectedGroup = formValue(budget, 'group', budgetState.modal.defaultGroup || 'essentials');

  return `
    <div class="modal-backdrop" data-budget-action="close-modal">
      <article class="transaction-modal budget-modal" role="dialog" aria-modal="true" aria-labelledby="budget-form-title">
        <div class="modal-header">
          <div>
            <p class="eyebrow">${isEdit ? 'Edit' : 'Add'} budget</p>
            <h2 id="budget-form-title">${isEdit ? 'Update budget' : 'Create category budget'}</h2>
          </div>
          <button type="button" class="icon-button" data-budget-action="close-modal" aria-label="Close budget form">×</button>
        </div>
        <form class="transaction-form budget-form" data-budget-form>
          <input type="hidden" name="id" value="${formValue(budget, 'id')}" />
          <label>Category<input name="category" value="${formValue(budget, 'category')}" placeholder="Groceries" required /></label>
          <label>Group<select name="group">
            ${budgetGroups.map((group) => `<option value="${group}" ${group === selectedGroup ? 'selected' : ''}>${titleCase(group)}</option>`).join('')}
          </select></label>
          <label>Monthly limit<input name="monthlyLimit" type="number" min="0" step="1" value="${formValue(budget, 'monthlyLimit', 0)}" required /></label>
          <label>Spent amount<input name="spentAmount" type="number" min="0" step="1" value="${formValue(budget, 'spentAmount', 0)}" required /></label>
          <label>Budget period<input name="budgetPeriod" type="month" value="${periodInputValue(formValue(budget, 'budgetPeriod', 'June 2026'))}" required /></label>
          <label class="full-span">Notes<textarea name="notes" placeholder="What belongs in this budget?">${formValue(budget, 'notes')}</textarea></label>
          <div class="form-actions">
            <button type="button" class="secondary-button" data-budget-action="close-modal">Cancel</button>
            <button type="submit" class="primary-action">${isEdit ? 'Save changes' : 'Add budget'}</button>
          </div>
        </form>
      </article>
    </div>
  `;
}

export function renderBudgetsPage() {
  return `
    <section class="budgets-page" id="budgets-page">
      <section class="page-header budgets-header">
        <div>
          <p class="eyebrow">Budgets</p>
          <h1>Plan the month before it happens</h1>
          <p class="muted">Track category limits, spending progress, budget health, and grouped monthly plans.</p>
        </div>
        <button type="button" class="primary-action" data-budget-action="open-add">Add budget</button>
      </section>

      ${renderOverview()}
      <section class="budgets-stack">
        ${budgetGroups.map(renderBudgetGroup).join('')}
      </section>
      ${renderBudgetModal()}
    </section>
  `;
}

function refreshBudgetsPage() {
  const pageContent = document.querySelector('.page-content');
  if (pageContent && document.querySelector('#budgets-page')) {
    pageContent.innerHTML = renderBudgetsPage();
  }
}

function saveBudget(form) {
  const formData = new FormData(form);
  const monthlyLimit = Number(formData.get('monthlyLimit'));
  const spentAmount = Number(formData.get('spentAmount'));
  const percent = Math.round((spentAmount / Math.max(monthlyLimit, 1)) * 100);
  const status = percent > 100 ? 'Exceeded' : percent >= 80 ? 'Watch closely' : 'On track';
  const tone = percent > 100 ? 'rose' : percent >= 80 ? 'amber' : 'green';
  const budget = {
    id: formData.get('id') || createId('budget'),
    category: formData.get('category').trim(),
    group: formData.get('group'),
    monthlyLimit,
    spentAmount,
    budgetPeriod: formatPeriod(formData.get('budgetPeriod')),
    notes: formData.get('notes').trim(),
    title: formData.get('category').trim(),
    subtitle: titleCase(formData.get('group')),
    current: formatINR(spentAmount),
    target: formatINR(monthlyLimit),
    percent,
    meta: status,
    tone,
  };

  if (budgetState.modal.mode === 'edit') {
    budgetState.budgets = budgetState.budgets.map((item) => (item.id === budget.id ? budget : item));
  } else {
    budgetState.budgets = [budget, ...budgetState.budgets];
  }

  budgetState.modal = { mode: null, budgetId: null };
  refreshBudgetsPage();
}

if (typeof document !== 'undefined' && !window.__atlasBudgetsBound) {
  window.__atlasBudgetsBound = true;

  document.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-budget-action]');
    if (!actionTarget || !document.querySelector('#budgets-page')) return;

    const action = actionTarget.dataset.budgetAction;
    const budgetId = actionTarget.dataset.budgetId;

    if (actionTarget.classList.contains('modal-backdrop') && event.target !== actionTarget) {
      return;
    }

    if (actionTarget.classList.contains('modal-backdrop')) {
      budgetState.modal = { mode: null, budgetId: null };
      refreshBudgetsPage();
      return;
    }

    event.preventDefault();

    if (action === 'open-add') budgetState.modal = { mode: 'add', budgetId: null, defaultGroup: actionTarget.dataset.budgetGroup };
    if (action === 'edit') budgetState.modal = { mode: 'edit', budgetId };
    if (action === 'delete') budgetState.modal = { mode: 'delete', budgetId };
    if (action === 'close-modal') budgetState.modal = { mode: null, budgetId: null };
    if (action === 'confirm-delete') {
      budgetState.budgets = budgetState.budgets.filter((budget) => budget.id !== budgetState.modal.budgetId);
      budgetState.modal = { mode: null, budgetId: null };
    }

    refreshBudgetsPage();
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-budget-form]');
    if (!form) return;

    event.preventDefault();
    saveBudget(form);
  });
}
