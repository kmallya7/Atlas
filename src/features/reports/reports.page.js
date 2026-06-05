import { barChartCard, lineChartCard } from '../../components/chartCard.js';
import { cashFlow, categorySpend } from '../../data/mockData.js';

export function renderReportsPage() {
  const incomeBars = cashFlow.labels.map((label, index) => ({
    label,
    value: cashFlow.income[index],
    display: `₹${Math.round(cashFlow.income[index] / 1000)}K`,
  }));

  return `
    <section class="page-header">
      <p class="eyebrow">Reports</p>
      <h1>See the patterns clearly</h1>
      <p class="muted">Cash flow, spending, income, category breakdowns, and monthly comparisons for better decisions.</p>
    </section>

    <section class="reports-grid">
      ${lineChartCard({
        title: 'Cash flow report',
        subtitle: 'Monthly surplus after expenses',
        labels: cashFlow.labels,
        values: cashFlow.net,
      })}
      ${lineChartCard({
        title: 'Spending report',
        subtitle: 'Expense movement by month',
        labels: cashFlow.labels,
        values: cashFlow.expenses,
        accent: '#9a5b2f',
      })}
      ${barChartCard({
        title: 'Income report',
        subtitle: 'Monthly income comparison',
        items: incomeBars,
      })}
      ${barChartCard({
        title: 'Category breakdown',
        subtitle: 'Where June spending went',
        items: categorySpend,
      })}
    </section>
  `;
}
