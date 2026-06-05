const categories = ['Housing', 'Groceries', 'Dining', 'Transport', 'Travel', 'Investments', 'Salary', 'Utilities'];

export function renderSettingsPage() {
  return `
    <section class="page-header">
      <p class="eyebrow">Settings</p>
      <h1>Make Atlas yours</h1>
      <p class="muted">Manage categories, accounts, user profile details, and Indian currency preferences.</p>
    </section>

    <section class="settings-grid">
      <article class="panel">
        <div class="card-title-row">
          <div>
            <h3>Firebase profile</h3>
            <p>Placeholder until auth state is connected</p>
          </div>
        </div>
        <div class="profile-row">
          <span class="avatar-large">KM</span>
          <div>
            <strong>Karthick Mallya</strong>
            <p>karthick@example.com</p>
          </div>
        </div>
      </article>

      <article class="panel">
        <div class="card-title-row">
          <div>
            <h3>Currency</h3>
            <p>Default money format</p>
          </div>
          <strong>INR</strong>
        </div>
        <label class="settings-control">
          Display currency
          <select><option>Indian Rupee (₹)</option></select>
        </label>
      </article>

      <article class="panel">
        <div class="card-title-row">
          <div>
            <h3>Categories</h3>
            <p>Used for budgets, reports, and rules</p>
          </div>
        </div>
        <div class="chip-list">
          ${categories.map((category) => `<span>${category}</span>`).join('')}
        </div>
      </article>

      <article class="panel">
        <div class="card-title-row">
          <div>
            <h3>Account settings</h3>
            <p>Connection and manual account preferences</p>
          </div>
        </div>
        <div class="settings-list">
          <label><input type="checkbox" checked /> Include loans in net worth</label>
          <label><input type="checkbox" checked /> Show credit card balances as debts</label>
          <label><input type="checkbox" /> Hide archived manual accounts</label>
        </div>
      </article>
    </section>
  `;
}
