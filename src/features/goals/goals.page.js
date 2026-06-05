import { accounts, goals as seedGoals } from '../../data/mockData.js';
import { formatINR } from '../../utils/currency.js';
import { createId } from '../../utils/id.js';

const goalTypes = ['savings', 'emergency fund', 'debt payoff', 'travel', 'education', 'business', 'custom'];

const goalState = {
  goals: seedGoals.map((goal) => ({ ...goal })),
  modal: {
    mode: null,
    goalId: null,
  },
};

function titleCase(value) {
  return value
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatTargetDate(value) {
  if (!value) return 'No target date';

  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function goalPercent(goal) {
  return Math.round((goal.currentAmount / Math.max(goal.targetAmount, 1)) * 100);
}

function goalStatus(goal) {
  const percent = goalPercent(goal);
  if (percent >= 100) return 'completed';

  const today = new Date('2026-06-04T00:00:00');
  const target = new Date(`${goal.targetDate}T00:00:00`);
  const daysLeft = Math.ceil((target - today) / 86400000);
  if (daysLeft <= 90 && percent < 60) return 'behind';

  return 'on track';
}

function statusLabel(status) {
  if (status === 'completed') return 'Completed';
  if (status === 'behind') return 'Behind';
  return 'On track';
}

function statusTone(status) {
  if (status === 'completed') return 'safe';
  if (status === 'behind') return 'warning';
  return 'safe';
}

function goalTotals() {
  return goalState.goals.reduce(
    (summary, goal) => {
      summary.target += goal.targetAmount;
      summary.saved += goal.currentAmount;
      return summary;
    },
    { target: 0, saved: 0 },
  );
}

function goalViewModel(goal) {
  const percent = goalPercent(goal);
  const status = goalStatus(goal);
  const remaining = goal.targetAmount - goal.currentAmount;

  return {
    ...goal,
    percent,
    status,
    remaining,
  };
}

function formValue(goal, key, fallback = '') {
  return goal?.[key] ?? fallback;
}

function renderOverview() {
  const totals = goalTotals();
  const remaining = totals.target - totals.saved;
  const progress = Math.round((totals.saved / Math.max(totals.target, 1)) * 100);

  return `
    <section class="goal-overview-grid">
      <article class="goal-overview-card total">
        <span>Total goal target</span>
        <strong>${formatINR(totals.target)}</strong>
        <p>Across active savings, payoff, travel, education, and business goals</p>
      </article>
      <article class="goal-overview-card">
        <span>Total saved</span>
        <strong>${formatINR(totals.saved)}</strong>
        <p>${progress}% funded overall</p>
      </article>
      <article class="goal-overview-card">
        <span>Remaining</span>
        <strong>${formatINR(Math.max(remaining, 0))}</strong>
        <p>Still needed to complete all goals</p>
      </article>
      <article class="goal-overview-card">
        <span>Overall progress</span>
        <strong>${progress}%</strong>
        <div class="goal-overview-track"><span style="width: ${Math.min(progress, 100)}%"></span></div>
      </article>
    </section>
  `;
}

function renderGoalCard(goal) {
  const view = goalViewModel(goal);
  const status = statusTone(view.status);

  return `
    <article class="goal-card status-${status}">
      <div class="goal-card-header">
        <div>
          <span>${titleCase(view.type)}</span>
          <h3>${view.name}</h3>
          <p>${view.notes || 'No notes added'}</p>
        </div>
        <mark class="goal-status ${view.status.replace(' ', '-')}">${statusLabel(view.status)}</mark>
      </div>
      <div class="goal-progress-row">
        <strong>${formatINR(view.currentAmount)}</strong>
        <span>${view.percent}% of ${formatINR(view.targetAmount)}</span>
      </div>
      <div class="goal-progress-track">
        <span style="width: ${Math.min(view.percent, 100)}%"></span>
      </div>
      <div class="goal-meta-grid">
        <div><span>Remaining</span><b>${formatINR(Math.max(view.remaining, 0))}</b></div>
        <div><span>Target date</span><b>${formatTargetDate(view.targetDate)}</b></div>
        <div><span>Linked account</span><b>${view.linkedAccount || 'Unlinked'}</b></div>
      </div>
      <div class="goal-card-footer">
        <span>${view.remaining <= 0 ? 'Goal fully funded' : `${formatINR(view.remaining)} to go`}</span>
        <div class="table-actions">
          <button type="button" data-goal-action="edit" data-goal-id="${view.id}">Edit</button>
          <button type="button" data-goal-action="delete" data-goal-id="${view.id}">Delete</button>
        </div>
      </div>
    </article>
  `;
}

function renderGoalsGrid() {
  return `
    <section class="goals-section">
      <div class="goals-section-header">
        <div>
          <span>Goal cards</span>
          <h2>${goalState.goals.length} active goals</h2>
        </div>
        <p>Savings, emergency fund, debt payoff, travel, education, business, and custom goals</p>
      </div>
      <div class="goal-type-list">
        ${goalTypes.map((type) => `<span>${titleCase(type)}</span>`).join('')}
      </div>
      <div class="goal-card-grid">
        ${
          goalState.goals.length
            ? goalState.goals.map(renderGoalCard).join('')
            : `
              <article class="goal-empty-state">
                <strong>No goals yet</strong>
                <span>Create a goal to start tracking savings, payoff, travel, education, business, or custom plans.</span>
                <button type="button" class="secondary-button" data-goal-action="open-add">Add goal</button>
              </article>
            `
        }
      </div>
    </section>
  `;
}

function renderGoalModal() {
  const { mode, goalId } = goalState.modal;
  if (!mode) return '';

  const goal = goalState.goals.find((item) => item.id === goalId);

  if (mode === 'delete') {
    return `
      <div class="modal-backdrop" data-goal-action="close-modal">
        <article class="transaction-modal delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-goal-title">
          <h2 id="delete-goal-title">Delete goal?</h2>
          <p>This removes the mock goal from this session only. Firebase writes are not connected yet.</p>
          <div class="delete-preview">
            <strong>${goal?.name || 'Selected goal'}</strong>
            <span>${goal ? `${formatINR(goal.currentAmount)} of ${formatINR(goal.targetAmount)}` : ''}</span>
          </div>
          <div class="form-actions">
            <button type="button" class="secondary-button" data-goal-action="close-modal">Cancel</button>
            <button type="button" class="ghost-button" data-goal-action="confirm-delete">Delete</button>
          </div>
        </article>
      </div>
    `;
  }

  const isEdit = mode === 'edit';
  const selectedType = formValue(goal, 'type', 'savings');
  const selectedAccount = formValue(goal, 'linkedAccount', accounts[0]?.name || '');

  return `
    <div class="modal-backdrop" data-goal-action="close-modal">
      <article class="transaction-modal goal-modal" role="dialog" aria-modal="true" aria-labelledby="goal-form-title">
        <div class="modal-header">
          <div>
            <p class="eyebrow">${isEdit ? 'Edit' : 'Add'} goal</p>
            <h2 id="goal-form-title">${isEdit ? 'Update goal' : 'Create goal'}</h2>
          </div>
          <button type="button" class="icon-button" data-goal-action="close-modal" aria-label="Close goal form">×</button>
        </div>
        <form class="transaction-form goal-form" data-goal-form>
          <input type="hidden" name="id" value="${formValue(goal, 'id')}" />
          <label>Goal name<input name="name" value="${formValue(goal, 'name')}" placeholder="Emergency fund" required /></label>
          <label>Goal type<select name="type">
            ${goalTypes.map((type) => `<option value="${type}" ${type === selectedType ? 'selected' : ''}>${titleCase(type)}</option>`).join('')}
          </select></label>
          <label>Target amount<input name="targetAmount" type="number" min="0" step="1" value="${formValue(goal, 'targetAmount', 0)}" required /></label>
          <label>Current saved amount<input name="currentAmount" type="number" min="0" step="1" value="${formValue(goal, 'currentAmount', 0)}" required /></label>
          <label>Target date<input name="targetDate" type="date" value="${formValue(goal, 'targetDate', '2026-12-31')}" required /></label>
          <label>Linked account<select name="linkedAccount">
            <option value="">Unlinked</option>
            ${accounts.map((account) => `<option value="${account.name}" ${account.name === selectedAccount ? 'selected' : ''}>${account.name}</option>`).join('')}
          </select></label>
          <label class="full-span">Notes<textarea name="notes" placeholder="Purpose, contribution plan, or payoff strategy">${formValue(goal, 'notes')}</textarea></label>
          <div class="form-actions">
            <button type="button" class="secondary-button" data-goal-action="close-modal">Cancel</button>
            <button type="submit" class="primary-action">${isEdit ? 'Save changes' : 'Add goal'}</button>
          </div>
        </form>
      </article>
    </div>
  `;
}

export function renderGoalsPage() {
  return `
    <section class="goals-page" id="goals-page">
      <section class="page-header goals-header">
        <div>
          <p class="eyebrow">Goals</p>
          <h1>Fund the future on purpose</h1>
          <p class="muted">Track savings, emergency fund, debt payoff, travel, education, business, and custom goals.</p>
        </div>
        <button type="button" class="primary-action" data-goal-action="open-add">Add goal</button>
      </section>

      ${renderOverview()}
      ${renderGoalsGrid()}
      ${renderGoalModal()}
    </section>
  `;
}

function refreshGoalsPage() {
  const pageContent = document.querySelector('.page-content');
  if (pageContent && document.querySelector('#goals-page')) {
    pageContent.innerHTML = renderGoalsPage();
  }
}

function saveGoal(form) {
  const formData = new FormData(form);
  const targetAmount = Number(formData.get('targetAmount'));
  const currentAmount = Number(formData.get('currentAmount'));
  const percent = Math.round((currentAmount / Math.max(targetAmount, 1)) * 100);
  const goal = {
    id: formData.get('id') || createId('goal'),
    name: formData.get('name').trim(),
    type: formData.get('type'),
    targetAmount,
    currentAmount,
    targetDate: formData.get('targetDate'),
    linkedAccount: formData.get('linkedAccount'),
    notes: formData.get('notes').trim(),
    title: formData.get('name').trim(),
    subtitle: titleCase(formData.get('type')),
    current: formatINR(currentAmount),
    target: formatINR(targetAmount),
    percent,
    meta: `Target: ${formatTargetDate(formData.get('targetDate'))}`,
    tone: percent >= 100 ? 'green' : percent < 45 ? 'amber' : 'blue',
  };

  if (goalState.modal.mode === 'edit') {
    goalState.goals = goalState.goals.map((item) => (item.id === goal.id ? goal : item));
  } else {
    goalState.goals = [goal, ...goalState.goals];
  }

  goalState.modal = { mode: null, goalId: null };
  refreshGoalsPage();
}

if (typeof document !== 'undefined' && !window.__atlasGoalsBound) {
  window.__atlasGoalsBound = true;

  document.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-goal-action]');
    if (!actionTarget || !document.querySelector('#goals-page')) return;

    const action = actionTarget.dataset.goalAction;
    const goalId = actionTarget.dataset.goalId;

    if (actionTarget.classList.contains('modal-backdrop') && event.target !== actionTarget) {
      return;
    }

    if (actionTarget.classList.contains('modal-backdrop')) {
      goalState.modal = { mode: null, goalId: null };
      refreshGoalsPage();
      return;
    }

    event.preventDefault();

    if (action === 'open-add') goalState.modal = { mode: 'add', goalId: null };
    if (action === 'edit') goalState.modal = { mode: 'edit', goalId };
    if (action === 'delete') goalState.modal = { mode: 'delete', goalId };
    if (action === 'close-modal') goalState.modal = { mode: null, goalId: null };
    if (action === 'confirm-delete') {
      goalState.goals = goalState.goals.filter((goal) => goal.id !== goalState.modal.goalId);
      goalState.modal = { mode: null, goalId: null };
    }

    refreshGoalsPage();
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-goal-form]');
    if (!form) return;

    event.preventDefault();
    saveGoal(form);
  });
}
