import { progressCard } from '../../components/progressCard.js';
import { transactionTable } from '../../components/transactionTable.js';
import { budgets, cashFlow, categorySpend, goals, transactions } from '../../data/mockData.js';
import { formatINR } from '../../utils/currency.js';

const dashboardMetrics = {
  netWorth: 3840000,
  netWorthChange: 270000,
  cashFlow: 114000,
  income: 360000,
  expenses: 246000,
  budgetUsed: 235000,
  budgetLimit: 325000,
};

function compactINR(amount) {
  if (Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
  }

  return formatINR(amount);
}

function miniBars(items) {
  const max = Math.max(...items.map((item) => item.value));

  return `
    <div class="mini-bars">
      ${items
        .map(
          (item) => `
            <div class="mini-bar">
              <div class="mini-bar-track">
                <strong style="height: ${(item.value / max) * 100}%"></strong>
              </div>
              <span>${item.label}</span>
            </div>
          `,
        )
        .join('')}
    </div>
  `;
}

function trendLine(values) {
  const width = 420;
  const height = 132;
  const padding = 12;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / (values.length - 1);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');
  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return `
    <svg class="dashboard-line" viewBox="0 0 ${width} ${height}" role="img" aria-label="Monthly spending trend">
      <defs>
        <linearGradient id="dashboard-spend-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.18"></stop>
          <stop offset="100%" stop-color="currentColor" stop-opacity="0"></stop>
        </linearGradient>
      </defs>
      <path class="dashboard-grid-line" d="M12 34 H408 M12 70 H408 M12 106 H408"></path>
      <polygon points="${areaPoints}" fill="url(#dashboard-spend-fill)"></polygon>
      <polyline points="${points}" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
      ${points
        .split(' ')
        .map((point) => {
          const [cx, cy] = point.split(',');
          return `<circle cx="${cx}" cy="${cy}" r="4" fill="#fff" stroke="currentColor" stroke-width="3"></circle>`;
        })
        .join('')}
    </svg>
  `;
}

function incomeExpenseCard() {
  const incomePercent = 100;
  const expensePercent = (dashboardMetrics.expenses / dashboardMetrics.income) * 100;

  return `
    <article class="dashboard-card income-expense-card">
      <div class="dashboard-card-header">
        <div>
          <span>Income vs expense</span>
          <h3>June comparison</h3>
        </div>
        <b>+${compactINR(dashboardMetrics.cashFlow)}</b>
      </div>
      <div class="comparison-stack">
        <div>
          <div class="comparison-label"><span>Income</span><strong>${formatINR(dashboardMetrics.income)}</strong></div>
          <div class="comparison-track income"><span style="width: ${incomePercent}%"></span></div>
        </div>
        <div>
          <div class="comparison-label"><span>Expenses</span><strong>${formatINR(dashboardMetrics.expenses)}</strong></div>
          <div class="comparison-track expense"><span style="width: ${expensePercent}%"></span></div>
        </div>
      </div>
      <p>You kept 32% of income after planned bills, investments, and daily spending.</p>
    </article>
  `;
}

function categoryCard() {
  return `
    <article class="dashboard-card category-card-large">
      <div class="dashboard-card-header">
        <div>
          <span>Spending by category</span>
          <h3>Where money went</h3>
        </div>
        <b>₹2.46L</b>
      </div>
      <div class="category-bars">
        ${categorySpend
          .map(
            (item) => `
              <div class="category-row">
                <div>
                  <span>${item.label}</span>
                  <strong>${item.display}</strong>
                </div>
                <div class="category-track">
                  <span style="width: ${(item.value / categorySpend[0].value) * 100}%"></span>
                </div>
              </div>
            `,
          )
          .join('')}
      </div>
    </article>
  `;
}

export function renderDashboard() {
  const budgetPercent = Math.round((dashboardMetrics.budgetUsed / dashboardMetrics.budgetLimit) * 100);

  return `
    <section class="dashboard-page">
      <section class="dashboard-welcome">
        <div>
          <p class="eyebrow">Dashboard</p>
          <h1>Good evening, Karthick</h1>
          <p class="muted">A calm view of your net worth, cash flow, spending, budgets, transactions, and goals for June.</p>
        </div>
        <div class="dashboard-period">
          <span>Monthly view</span>
          <strong>June 2026</strong>
        </div>
      </section>

      <section class="dashboard-mosaic">
        <article class="dashboard-card net-worth-card">
          <div class="dashboard-card-header">
            <div>
              <span>Net worth</span>
              <h3>${compactINR(dashboardMetrics.netWorth)}</h3>
            </div>
            <b>+${compactINR(dashboardMetrics.netWorthChange)} YTD</b>
          </div>
          <p>Assets minus loans, cards, and other liabilities. Atlas is trending up steadily this year.</p>
          <div class="net-worth-split">
            <div><span>Assets</span><strong>₹67.6L</strong></div>
            <div><span>Debts</span><strong>₹29.2L</strong></div>
            <div><span>Liquid cash</span><strong>₹6.6L</strong></div>
          </div>
          ${miniBars([
            { label: 'Jan', value: 3280000 },
            { label: 'Feb', value: 3360000 },
            { label: 'Mar', value: 3510000 },
            { label: 'Apr', value: 3620000 },
            { label: 'May', value: 3710000 },
            { label: 'Jun', value: dashboardMetrics.netWorth },
          ])}
        </article>

        <div class="dashboard-side-stack">
        <article class="dashboard-card cash-flow-card">
          <div class="dashboard-card-header">
            <div>
              <span>Cash flow</span>
              <h3>+${compactINR(dashboardMetrics.cashFlow)}</h3>
            </div>
            <b>Healthy</b>
          </div>
          <p>Income left after expenses and scheduled transfers this month.</p>
          <div class="cash-flow-breakdown">
            <div><span>Income</span><strong>${compactINR(dashboardMetrics.income)}</strong></div>
            <div><span>Expenses</span><strong>${compactINR(dashboardMetrics.expenses)}</strong></div>
          </div>
        </article>

        ${incomeExpenseCard()}
        </div>
      </section>

      <section class="dashboard-main-grid">
        <article class="dashboard-card spending-trend-card">
          <div class="dashboard-card-header">
            <div>
              <span>Monthly spending trend</span>
              <h3>Expenses over time</h3>
            </div>
            <b>${compactINR(cashFlow.expenses[cashFlow.expenses.length - 1])}</b>
          </div>
          ${trendLine(cashFlow.expenses)}
          <div class="trend-labels">
            ${cashFlow.labels.map((label) => `<span>${label}</span>`).join('')}
          </div>
        </article>

        ${categoryCard()}
      </section>

      <section class="dashboard-bottom-grid">
        <article class="dashboard-card budget-focus-card">
          <div class="dashboard-card-header">
            <div>
              <span>Budget progress</span>
              <h3>${budgetPercent}% used</h3>
            </div>
            <b>${formatINR(dashboardMetrics.budgetLimit - dashboardMetrics.budgetUsed)} left</b>
          </div>
          <div class="hero-progress">
            <span style="width: ${budgetPercent}%"></span>
          </div>
          <div class="compact-progress-list">
            ${budgets.map(progressCard).join('')}
          </div>
        </article>

        <article class="dashboard-card goals-focus-card">
          <div class="dashboard-card-header">
            <div>
              <span>Goals progress</span>
              <h3>3 active goals</h3>
            </div>
            <b>₹11.8L saved</b>
          </div>
          <div class="compact-progress-list">
            ${goals.map(progressCard).join('')}
          </div>
        </article>
      </section>

      <section class="dashboard-transactions">
        ${transactionTable(transactions, { compact: true })}
      </section>
    </section>
  `;
}
