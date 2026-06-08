import { accounts as seedAccounts } from '../../data/mockData.js';
import { icon } from '../../components/icons.js';
import { createId } from '../../utils/id.js';

const transactionTypes = ['Expense', 'Income', 'Transfer'];
const themes = ['System default', 'Light', 'Dark'];

const settingsState = {
  profile: {
    name: 'Karthick Mallya',
    email: 'karthick@example.com',
    currency: 'INR',
  },
  preferences: {
    theme: 'System default',
    defaultAccount: 'HDFC Salary Account',
    defaultTransactionType: 'Expense',
    monthStartDay: 1,
  },
  accountPreferences: {
    showInactiveAccounts: false,
    defaultCashAccount: 'Wallet and cash',
  },
  categories: {
    income: [
      { id: 'cat-salary', name: 'Salary', description: 'Primary salary and payroll credits' },
      { id: 'cat-freelance', name: 'Freelance', description: 'Client invoices and consulting income' },
      { id: 'cat-interest', name: 'Interest', description: 'Bank interest and cashback credits' },
      { id: 'cat-rent-income', name: 'Rental income', description: 'Property income and tenant payments' },
    ],
    expense: [
      { id: 'cat-housing', name: 'Housing', description: 'Rent, maintenance, and society charges' },
      { id: 'cat-groceries', name: 'Groceries', description: 'Pantry, household goods, and staples' },
      { id: 'cat-dining', name: 'Dining', description: 'Restaurants, cafes, and delivery' },
      { id: 'cat-transport', name: 'Transport', description: 'Fuel, rides, metro, and parking' },
      { id: 'cat-utilities', name: 'Utilities', description: 'Power, internet, mobile, and water' },
      { id: 'cat-investments', name: 'Investments', description: 'SIPs, stocks, and savings transfers' },
    ],
  },
  modal: {
    mode: null,
    categoryType: null,
    categoryId: null,
  },
  formError: '',
  notice: '',
};

function accountNames() {
  return seedAccounts.map((account) => account.name);
}

function cashAccountNames() {
  return seedAccounts.filter((account) => account.type === 'Cash').map((account) => account.name);
}

function selected(value, currentValue) {
  return value === currentValue ? 'selected' : '';
}

function checked(value) {
  return value ? 'checked' : '';
}

function categoryCount() {
  return settingsState.categories.income.length + settingsState.categories.expense.length;
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function findCategory(type, categoryId) {
  return settingsState.categories[type]?.find((category) => category.id === categoryId);
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderProfileSection() {
  return `
    <article class="panel settings-panel profile-settings">
      <div class="card-title-row">
        <div>
          <h3>Profile settings</h3>
          <p>Mock user details for the future Firebase profile</p>
        </div>
        <span class="settings-badge">INR</span>
      </div>
      <div class="settings-profile-card">
        <span class="avatar-large">KM</span>
        <div>
          <strong>${settingsState.profile.name}</strong>
          <p>${settingsState.profile.email}</p>
        </div>
      </div>
      <div class="form-grid settings-form-grid">
        <label>Name<input name="profileName" value="${settingsState.profile.name}" data-settings-field="profile.name" /></label>
        <label>Email<input name="profileEmail" type="email" value="${settingsState.profile.email}" data-settings-field="profile.email" /></label>
        <label class="full-span">Currency<select name="currency" data-settings-field="profile.currency">
          <option value="INR" selected>Indian Rupee (INR)</option>
        </select></label>
      </div>
    </article>
  `;
}

function renderPreferenceSection() {
  return `
    <article class="panel settings-panel">
      <div class="card-title-row">
        <div>
          <h3>App preferences</h3>
          <p>Default choices used by mock forms and summaries</p>
        </div>
      </div>
      <div class="form-grid settings-form-grid">
        <label>Theme<select name="theme" data-settings-field="preferences.theme">
          ${themes.map((theme) => `<option value="${theme}" ${selected(theme, settingsState.preferences.theme)}>${theme}</option>`).join('')}
        </select></label>
        <label>Default account<select name="defaultAccount" data-settings-field="preferences.defaultAccount">
          ${accountNames().map((account) => `<option value="${account}" ${selected(account, settingsState.preferences.defaultAccount)}>${account}</option>`).join('')}
        </select></label>
        <label>Default transaction type<select name="defaultTransactionType" data-settings-field="preferences.defaultTransactionType">
          ${transactionTypes.map((type) => `<option value="${type}" ${selected(type, settingsState.preferences.defaultTransactionType)}>${type}</option>`).join('')}
        </select></label>
        <label>Month start day<input name="monthStartDay" type="number" min="1" max="28" value="${settingsState.preferences.monthStartDay}" data-settings-field="preferences.monthStartDay" /></label>
      </div>
    </article>
  `;
}

function renderCategoryList(type) {
  const categories = settingsState.categories[type];

  if (!categories.length) {
    return `
      <article class="settings-empty-state">
        <strong>No ${type} categories</strong>
        <span>Add a ${type} category to keep future transactions tidy.</span>
        <button type="button" class="secondary-button" data-settings-action="open-add-category" data-category-type="${type}">
          ${icon('plus')} Add ${titleCase(type)}
        </button>
      </article>
    `;
  }

  return categories
    .map(
      (category) => `
        <article class="settings-category-row">
          <div>
            <strong>${category.name}</strong>
            <span>${category.description || 'No description added'}</span>
          </div>
          <div class="table-actions">
            <button type="button" data-settings-action="edit-category" data-category-type="${type}" data-category-id="${category.id}">Edit</button>
            <button type="button" data-settings-action="delete-category" data-category-type="${type}" data-category-id="${category.id}">Delete</button>
          </div>
        </article>
      `,
    )
    .join('');
}

function renderCategorySection() {
  return `
    <section class="panel settings-panel settings-category-management">
      <div class="card-title-row">
        <div>
          <h3>Category management</h3>
          <p>${categoryCount()} mock categories available for future rules, reports, and budgets</p>
        </div>
        <button type="button" class="primary-action" data-settings-action="open-add-category" data-category-type="expense">
          ${icon('plus')} Add category
        </button>
      </div>
      ${settingsState.notice ? `<div class="settings-notice" role="status">${settingsState.notice}</div>` : ''}
      <div class="settings-category-grid">
        <section class="settings-category-group">
          <div class="settings-section-heading">
            <span>Income categories</span>
            <button type="button" class="secondary-button" data-settings-action="open-add-category" data-category-type="income">
              ${icon('plus')} Add income
            </button>
          </div>
          <div class="settings-category-list">
            ${renderCategoryList('income')}
          </div>
        </section>
        <section class="settings-category-group">
          <div class="settings-section-heading">
            <span>Expense categories</span>
            <button type="button" class="secondary-button" data-settings-action="open-add-category" data-category-type="expense">
              ${icon('plus')} Add expense
            </button>
          </div>
          <div class="settings-category-list">
            ${renderCategoryList('expense')}
          </div>
        </section>
      </div>
    </section>
  `;
}

function renderAccountPreferencesSection() {
  const cashAccounts = cashAccountNames();

  return `
    <article class="panel settings-panel">
      <div class="card-title-row">
        <div>
          <h3>Account preferences</h3>
          <p>Mock defaults for account pickers and visibility</p>
        </div>
      </div>
      <div class="settings-toggle-list">
        <label class="settings-toggle">
          <span>
            <strong>Show inactive accounts</strong>
            <small>Display archived or closed accounts in selectors</small>
          </span>
          <input type="checkbox" ${checked(settingsState.accountPreferences.showInactiveAccounts)} data-settings-toggle="accountPreferences.showInactiveAccounts" />
        </label>
      </div>
      <label class="settings-control">Default cash account
        <select name="defaultCashAccount" data-settings-field="accountPreferences.defaultCashAccount">
          ${
            cashAccounts.length
              ? cashAccounts.map((account) => `<option value="${account}" ${selected(account, settingsState.accountPreferences.defaultCashAccount)}>${account}</option>`).join('')
              : '<option>No cash accounts available</option>'
          }
        </select>
      </label>
      ${
        cashAccounts.length
          ? ''
          : '<div class="settings-inline-error" role="status">No cash accounts were found in mock data.</div>'
      }
    </article>
  `;
}

function renderDataSection() {
  return `
    <article class="panel settings-panel">
      <div class="card-title-row">
        <div>
          <h3>Data</h3>
          <p>Placeholders only until persistence is connected</p>
        </div>
      </div>
      <div class="settings-action-stack">
        <button type="button" class="secondary-button" data-settings-action="placeholder" data-placeholder-label="Export data">Export data</button>
        <button type="button" class="secondary-button" data-settings-action="placeholder" data-placeholder-label="Import data">Import data</button>
        <button type="button" class="ghost-button" data-settings-action="placeholder" data-placeholder-label="Reset demo data">Reset demo data</button>
      </div>
    </article>
  `;
}

function renderFirebaseSection(user) {
  return `
    <article class="panel settings-panel">
      <div class="card-title-row">
        <div>
          <h3>Firebase connection</h3>
          <p>Auth is connected; database reads and writes are still off</p>
        </div>
      </div>
      <div class="settings-status-list">
        <div class="settings-status-row">
          <span>Auth status</span>
          <strong class="is-connected">Connected</strong>
        </div>
        <div class="settings-status-row">
          <span>Database status</span>
          <strong>Not connected</strong>
        </div>
      </div>
      <div class="settings-auth-user">
        <span>Signed in as</span>
        <strong>${escapeHtml(user?.name || 'Atlas user')}</strong>
        <p>${escapeHtml(user?.email || 'Google account')}</p>
      </div>
    </article>
  `;
}

function renderCategoryModal() {
  const { mode, categoryType, categoryId } = settingsState.modal;
  if (!mode) return '';

  const category = findCategory(categoryType, categoryId);

  if (mode === 'delete') {
    return `
      <div class="modal-backdrop" data-settings-action="close-modal">
        <article class="transaction-modal delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-category-title">
          <h2 id="delete-category-title">Delete category?</h2>
          <p>This removes the mock ${categoryType} category for this browser session only.</p>
          <div class="delete-preview">
            <strong>${category?.name || 'Selected category'}</strong>
            <span>${category?.description || 'No description added'}</span>
          </div>
          <div class="form-actions">
            <button type="button" class="secondary-button" data-settings-action="close-modal">Cancel</button>
            <button type="button" class="ghost-button" data-settings-action="confirm-delete-category">Delete</button>
          </div>
        </article>
      </div>
    `;
  }

  const isEdit = mode === 'edit';

  return `
    <div class="modal-backdrop" data-settings-action="close-modal">
      <article class="transaction-modal settings-category-modal" role="dialog" aria-modal="true" aria-labelledby="category-form-title">
        <div class="modal-header">
          <div>
            <p class="eyebrow">${isEdit ? 'Edit' : 'Add'} category</p>
            <h2 id="category-form-title">${isEdit ? 'Update category' : `Create ${categoryType} category`}</h2>
          </div>
          <button type="button" class="icon-button" data-settings-action="close-modal" aria-label="Close category form">×</button>
        </div>
        ${settingsState.formError ? `<div class="settings-inline-error" role="alert">${settingsState.formError}</div>` : ''}
        <form class="transaction-form settings-category-form" data-settings-category-form>
          <input type="hidden" name="id" value="${category?.id || ''}" />
          <input type="hidden" name="categoryType" value="${categoryType}" />
          <label>Category type<select name="type">
            <option value="income" ${selected('income', categoryType)}>Income</option>
            <option value="expense" ${selected('expense', categoryType)}>Expense</option>
          </select></label>
          <label>Category name<input name="name" value="${category?.name || ''}" placeholder="Category name" required /></label>
          <label class="full-span">Description<textarea name="description" placeholder="What belongs in this category?">${category?.description || ''}</textarea></label>
          <div class="form-actions">
            <button type="button" class="secondary-button" data-settings-action="close-modal">Cancel</button>
            <button type="submit" class="primary-action">${isEdit ? 'Save changes' : 'Add category'}</button>
          </div>
        </form>
      </article>
    </div>
  `;
}

export function renderSettingsPage(context = {}) {
  return `
    <section class="settings-page" id="settings-page">
      <section class="page-header settings-header">
        <div>
          <p class="eyebrow">Settings</p>
          <h1>Make Atlas yours</h1>
          <p class="muted">Manage mock profile details, INR defaults, preferences, categories, and future connection status.</p>
        </div>
      </section>

      <section class="settings-grid">
        ${renderProfileSection()}
        ${renderPreferenceSection()}
        ${renderCategorySection()}
        ${renderAccountPreferencesSection()}
        ${renderDataSection()}
        ${renderFirebaseSection(context.user)}
      </section>
      ${renderCategoryModal()}
    </section>
  `;
}

function refreshSettingsPage() {
  const pageContent = document.querySelector('.page-content');
  if (pageContent && document.querySelector('#settings-page')) {
    pageContent.innerHTML = renderSettingsPage();
  }
}

function updateNestedState(path, value) {
  const [group, key] = path.split('.');
  settingsState[group][key] = value;
}

function saveCategory(form) {
  const formData = new FormData(form);
  const id = formData.get('id') || createId('category');
  const oldType = formData.get('categoryType');
  const newType = formData.get('type');
  const name = formData.get('name').trim();
  const description = formData.get('description').trim();

  if (!name) {
    settingsState.formError = 'Category name is required.';
    refreshSettingsPage();
    return;
  }

  const duplicate = settingsState.categories[newType].some((category) => category.id !== id && category.name.toLowerCase() === name.toLowerCase());

  if (duplicate) {
    settingsState.formError = 'A category with this name already exists in that group.';
    refreshSettingsPage();
    return;
  }

  const category = { id, name, description };

  settingsState.categories[oldType] = settingsState.categories[oldType].filter((item) => item.id !== id);
  settingsState.categories[newType] = [category, ...settingsState.categories[newType]];
  settingsState.modal = { mode: null, categoryType: null, categoryId: null };
  settingsState.formError = '';
  settingsState.notice = `${name} saved in ${newType} categories.`;
  refreshSettingsPage();
}

if (typeof document !== 'undefined' && !window.__atlasSettingsBound) {
  window.__atlasSettingsBound = true;

  document.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-settings-action]');
    if (!actionTarget || !document.querySelector('#settings-page')) return;

    const action = actionTarget.dataset.settingsAction;
    const categoryType = actionTarget.dataset.categoryType;
    const categoryId = actionTarget.dataset.categoryId;

    if (actionTarget.classList.contains('modal-backdrop') && event.target !== actionTarget) {
      return;
    }

    if (actionTarget.classList.contains('modal-backdrop')) {
      settingsState.modal = { mode: null, categoryType: null, categoryId: null };
      settingsState.formError = '';
      refreshSettingsPage();
      return;
    }

    event.preventDefault();

    if (action === 'open-add-category') {
      settingsState.modal = { mode: 'add', categoryType, categoryId: null };
      settingsState.formError = '';
    }

    if (action === 'edit-category') {
      settingsState.modal = { mode: 'edit', categoryType, categoryId };
      settingsState.formError = '';
    }

    if (action === 'delete-category') {
      settingsState.modal = { mode: 'delete', categoryType, categoryId };
      settingsState.formError = '';
    }

    if (action === 'close-modal') {
      settingsState.modal = { mode: null, categoryType: null, categoryId: null };
      settingsState.formError = '';
    }

    if (action === 'confirm-delete-category') {
      const { categoryType: type, categoryId: id } = settingsState.modal;
      const category = findCategory(type, id);
      settingsState.categories[type] = settingsState.categories[type].filter((item) => item.id !== id);
      settingsState.modal = { mode: null, categoryType: null, categoryId: null };
      settingsState.notice = `${category?.name || 'Category'} deleted from ${type} categories.`;
    }

    if (action === 'placeholder') {
      settingsState.notice = `${actionTarget.dataset.placeholderLabel} is a placeholder until data tools are connected.`;
    }

    refreshSettingsPage();
  });

  document.addEventListener('change', (event) => {
    const field = event.target.closest('[data-settings-field]');
    const toggle = event.target.closest('[data-settings-toggle]');
    if ((!field && !toggle) || !document.querySelector('#settings-page')) return;

    if (field) {
      const value = field.type === 'number' ? Number(field.value) : field.value;
      updateNestedState(field.dataset.settingsField, value);
    }

    if (toggle) {
      updateNestedState(toggle.dataset.settingsToggle, toggle.checked);
    }

    settingsState.notice = 'Mock settings updated for this session.';
    refreshSettingsPage();
  });

  document.addEventListener('input', (event) => {
    const field = event.target.closest('input[data-settings-field]');
    if (!field || !document.querySelector('#settings-page')) return;

    const value = field.type === 'number' ? Number(field.value) : field.value;
    updateNestedState(field.dataset.settingsField, value);
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-settings-category-form]');
    if (!form) return;

    event.preventDefault();
    saveCategory(form);
  });
}
