import { icon } from '../../components/icons.js';
import { formatINR } from '../../utils/currency.js';

const widgetOrderStorageKey = 'atlas-dashboard-widget-order';
const widgetVisibilityStorageKey = 'atlas-dashboard-widget-visibility';

const dashboardWidgets = [
  { id: 'getting-started', name: 'Getting started guide', defaultVisible: false },
  { id: 'budget', name: 'Budget', defaultVisible: true },
  { id: 'credit-score', name: 'Credit score', defaultVisible: true },
  { id: 'net-worth', name: 'Net worth', defaultVisible: true },
  { id: 'goals', name: 'Savings goals', defaultVisible: true },
  { id: 'spending', name: 'Spending trend', defaultVisible: true },
  { id: 'transactions', name: 'Transactions', defaultVisible: true },
  { id: 'recurring', name: 'Recurring transactions', defaultVisible: true },
  { id: 'investments', name: 'Investments', defaultVisible: true },
  { id: 'advice', name: 'Advice', defaultVisible: true },
];

const netWorthPoints = [
  { label: 'Jun 1', range: 'Jun 1, 2026 - Jun 1, 2026', value: 3720000, comparison: 0 },
  { label: 'Jun 3', range: 'Jun 1, 2026 - Jun 3, 2026', value: 3770000, comparison: 50000 },
  { label: 'Jun 5', range: 'Jun 1, 2026 - Jun 5, 2026', value: 3810000, comparison: 90000 },
  { label: 'Jun 8', range: 'Jun 1, 2026 - Jun 8, 2026', value: 3840000, comparison: 120000 },
];

const spendingPoints = [
  { label: 'Day 1', range: 'Jun 1, 2026', value: 18000, comparison: 24000 },
  { label: 'Day 7', range: 'Jun 1, 2026 - Jun 7, 2026', value: 92000, comparison: 108000 },
  { label: 'Day 13', range: 'Jun 1, 2026 - Jun 13, 2026', value: 146000, comparison: 157000 },
  { label: 'Day 19', range: 'Jun 1, 2026 - Jun 19, 2026', value: 201000, comparison: 212000 },
  { label: 'Day 25', range: 'Jun 1, 2026 - Jun 25, 2026', value: 246000, comparison: 238000 },
  { label: 'Day 31', range: 'Jun 1, 2026 - Jun 30, 2026', value: 246000, comparison: 257000 },
];

function compactINR(amount) {
  if (Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
  }

  return formatINR(amount);
}

function dashboardGreeting(name = 'Karthick') {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return `Good morning, ${name}!`;
  if (hour >= 12 && hour < 17) return `Good afternoon, ${name}!`;
  if (hour >= 17 && hour < 21) return `Good evening, ${name}!`;
  return `Good night, ${name}!`;
}

function chartCoordinates(points, { width, height, paddingX, paddingY, min, max }) {
  const range = max - min || 1;

  return points.map((point, index) => {
    const x = paddingX + (index * (width - paddingX * 2)) / (points.length - 1);
    const y = height - paddingY - ((point.value - min) / range) * (height - paddingY * 2);
    return { ...point, x, y };
  });
}

function smoothPath(points) {
  return points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;

      const previous = points[index - 1];
      const controlOffset = (point.x - previous.x) * 0.48;
      return `C ${previous.x + controlOffset} ${previous.y}, ${point.x - controlOffset} ${point.y}, ${point.x} ${point.y}`;
    })
    .join(' ');
}

function dashboardDropdown(id, label, options) {
  return `
    <div class="dashboard-dropdown" data-dashboard-dropdown="${id}">
      <button class="dashboard-select" type="button" aria-haspopup="listbox" aria-expanded="false">
        <span>${label}</span>
        ${icon('chevronDown', 'dashboard-select-icon')}
      </button>
      <div class="dashboard-menu" role="listbox" tabindex="-1">
        ${options
          .map(
            (option, index) => `
              <button
                class="dashboard-menu-item ${index === 0 ? 'is-active' : ''}"
                type="button"
                role="option"
                aria-selected="${index === 0 ? 'true' : 'false'}"
                data-dashboard-option="${option}"
              >
                ${option}
              </button>
            `,
          )
          .join('')}
      </div>
    </div>
  `;
}

function widgetDragHandle(label = 'Reorder widget') {
  return `<span class="widget-drag-handle" aria-label="${label}" title="${label}"></span>`;
}

function cardHeader({ title, subtitle = '', filter = '' }) {
  return `
    <div class="monarch-card-header">
      <div class="monarch-card-title-row">
        ${widgetDragHandle()}
        <div class="monarch-title-group">
          <h2>${title}</h2>
          ${subtitle ? `<span>${subtitle}</span>` : ''}
          ${icon('zap', 'sparkle-icon')}
        </div>
      </div>
      ${filter}
    </div>
  `;
}

function emptyState({ iconName, title, description = '', button = '' }) {
  return `
    <div class="monarch-empty">
      ${icon(iconName, 'monarch-empty-icon')}
      <strong>${title}</strong>
      ${description ? `<p>${description}</p>` : ''}
      ${button ? `<button class="monarch-button" type="button">${button}</button>` : ''}
    </div>
  `;
}

function netWorthChart() {
  const width = 760;
  const height = 250;
  const paddingX = 58;
  const paddingY = 30;
  const min = 3600000;
  const max = 3900000;
  const points = chartCoordinates(netWorthPoints, { width, height, paddingX, paddingY, min, max });
  const path = smoothPath(points);
  const area = `${path} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return `
    <div
      class="atlas-chart atlas-chart-networth"
      data-chart-kind="networth"
      data-chart-title="net worth"
      data-chart-value-label="${formatINR(netWorthPoints[netWorthPoints.length - 1].value)}"
      data-chart-comparison-label="${formatINR(netWorthPoints[netWorthPoints.length - 1].comparison)}"
    >
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Net worth over time">
        <defs>
          <linearGradient id="net-worth-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="currentColor" stop-opacity="0.36"></stop>
            <stop offset="100%" stop-color="currentColor" stop-opacity="0.04"></stop>
          </linearGradient>
        </defs>
        <path class="chart-grid" d="M58 42 H734 M58 96 H734 M58 150 H734 M58 204 H734"></path>
        <g class="chart-y-labels">
          <text x="16" y="47">₹39L</text>
          <text x="16" y="101">₹38L</text>
          <text x="16" y="155">₹37L</text>
          <text x="16" y="209">₹36L</text>
        </g>
        <path class="chart-area" d="${area}"></path>
        <path class="chart-line networth-line" d="${path}"></path>
        ${points
          .map(
            (point) => `
              <circle
                class="chart-hit-point"
                cx="${point.x}"
                cy="${point.y}"
                r="22"
                data-x="${point.x}"
                data-y="${point.y}"
                data-range="${point.range}"
                data-value="${formatINR(point.value)}"
                data-comparison="${formatINR(point.comparison)}"
              ></circle>
            `,
          )
          .join('')}
        <circle class="chart-marker" cx="${points[points.length - 1].x}" cy="${points[points.length - 1].y}" r="6"></circle>
        <line class="chart-guide" x1="${points[points.length - 1].x}" x2="${points[points.length - 1].x}" y1="30" y2="220"></line>
        <g class="chart-x-labels">
          <text x="${points[0].x}" y="238">Jun 1</text>
          <text x="${points[1].x}" y="238">Jun 3</text>
          <text x="${points[2].x}" y="238">Jun 5</text>
          <text x="${points[3].x}" y="238">Jun 8</text>
        </g>
      </svg>
      ${chartTooltip(netWorthPoints[netWorthPoints.length - 1].range, formatINR(3840000), formatINR(120000))}
    </div>
  `;
}

function spendingChart() {
  const width = 760;
  const height = 240;
  const paddingX = 58;
  const paddingY = 30;
  const min = 0;
  const max = 300000;
  const current = chartCoordinates(spendingPoints, { width, height, paddingX, paddingY, min, max });
  const previous = chartCoordinates(
    spendingPoints.map((point) => ({ ...point, value: point.comparison })),
    { width, height, paddingX, paddingY, min, max },
  );

  return `
    <div
      class="atlas-chart atlas-chart-spending"
      data-chart-kind="spending"
      data-chart-title="spending"
    >
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="This month spending compared with last month">
        <path class="chart-grid" d="M58 38 H734 M58 84 H734 M58 130 H734 M58 176 H734"></path>
        <g class="chart-y-labels">
          <text x="16" y="43">₹3L</text>
          <text x="16" y="89">₹2L</text>
          <text x="16" y="135">₹1L</text>
          <text x="16" y="181">₹0</text>
        </g>
        <path class="chart-line comparison-line" d="${smoothPath(previous)}"></path>
        <path class="chart-line spending-line" d="${smoothPath(current)}"></path>
        ${current
          .map(
            (point) => `
              <circle
                class="chart-hit-point"
                cx="${point.x}"
                cy="${point.y}"
                r="20"
                data-x="${point.x}"
                data-y="${point.y}"
                data-range="${point.range}"
                data-value="${formatINR(point.value)}"
                data-comparison="${formatINR(point.comparison)}"
              ></circle>
            `,
          )
          .join('')}
        <circle class="chart-marker" cx="${current[current.length - 2].x}" cy="${current[current.length - 2].y}" r="6"></circle>
        <line class="chart-guide" x1="${current[current.length - 2].x}" x2="${current[current.length - 2].x}" y1="30" y2="190"></line>
        <g class="chart-x-labels">
          ${current.map((point) => `<text x="${point.x}" y="222">${point.label}</text>`).join('')}
        </g>
      </svg>
      <div class="chart-legend" aria-hidden="true">
        <span><i class="legend-previous"></i>Last month</span>
        <span><i class="legend-current"></i>This month</span>
      </div>
      ${chartTooltip(spendingPoints[4].range, formatINR(spendingPoints[4].value), formatINR(spendingPoints[4].comparison))}
    </div>
  `;
}

function chartTooltip(range, value, comparison) {
  return `
    <div class="chart-tooltip" aria-hidden="true">
      <strong data-tooltip-range>${range}</strong>
      <div class="chart-tooltip-values">
        <span><small>Current</small><b data-tooltip-value>${value}</b></span>
        <span><small>Previous</small><b data-tooltip-comparison>${comparison}</b></span>
      </div>
      <button type="button">
        ${icon('sparkle', 'tooltip-icon')}
        <span>Explain this change</span>
      </button>
    </div>
  `;
}

function renderBudgetCard() {
  return `
    <article class="monarch-card budget-card" data-widget-card data-widget-id="budget" draggable="true">
      ${cardHeader({
        title: 'Budget',
        subtitle: 'June 2026',
        filter: dashboardDropdown('budget', 'Expenses', ['Expenses', 'Income', 'Transfers']),
      })}
      ${emptyState({
        iconName: 'map',
        title: "You don't have a budget yet",
        description: "We'll create one for you based on your spending history.",
        button: 'Create my budget',
      })}
    </article>
  `;
}

function renderCreditScoreCard() {
  return `
    <article class="monarch-card credit-card" data-widget-card data-widget-id="credit-score" draggable="true">
      ${cardHeader({ title: 'Credit score', subtitle: '' })}
      ${emptyState({
        iconName: 'card',
        title: 'Turn on credit score tracking',
        description: 'Keep track of your credit score right in your dashboard.',
        button: 'Enable credit score',
      })}
    </article>
  `;
}

function renderTransactionsCard() {
  return `
    <article class="monarch-card transactions-card" data-widget-card data-widget-id="transactions" draggable="true">
      ${cardHeader({
        title: 'Transactions',
        subtitle: 'Most recent',
        filter: dashboardDropdown('transactions', 'All transactions', ['All transactions', 'Income', 'Expenses']),
      })}
      ${emptyState({ iconName: 'card', title: 'You have no transactions yet.' })}
    </article>
  `;
}

function renderRecurringCard() {
  return `
    <article class="monarch-card recurring-card" data-widget-card data-widget-id="recurring" draggable="true">
      ${cardHeader({
        title: 'Recurring',
        subtitle: '$0 remaining due',
        filter: dashboardDropdown('recurring', 'This month', ['This month', 'This week']),
      })}
      ${emptyState({
        iconName: 'calendar',
        title: 'No upcoming transactions for this time period',
        description: 'Add new recurring transactions to see them here',
      })}
    </article>
  `;
}

function renderSpendingCard() {
  return `
    <article class="monarch-card spending-card" data-widget-card data-widget-id="spending" draggable="true">
      ${cardHeader({
        title: 'Spending',
        subtitle: 'This month vs. last month',
        filter: dashboardDropdown('spending', 'This month vs. last month', [
          'This month vs. last month',
          'This week vs. last week',
        ]),
      })}
      ${spendingChart()}
    </article>
  `;
}

function renderNetWorthCard() {
  return `
    <article class="monarch-card net-worth-card" data-widget-card data-widget-id="net-worth" draggable="true">
      ${cardHeader({
        title: `${compactINR(3840000)} net worth`,
        subtitle: formatINR(120000),
        filter: dashboardDropdown('net-worth', '1 month', ['1 month', '3 months', '1 year']),
      })}
      ${netWorthChart()}
    </article>
  `;
}

function renderInvestmentsCard() {
  return `
    <article class="monarch-card investments-card" data-widget-card data-widget-id="investments" draggable="true">
      ${cardHeader({ title: '$0 investments', subtitle: '$0.00 Today' })}
      <div class="monarch-section-label">Top movers today</div>
      ${emptyState({
        iconName: 'trend',
        title: 'No investment holdings with known securities',
        description: 'Please sync another investment account to see top movers',
      })}
    </article>
  `;
}

function renderGoalsCard() {
  return `
    <article class="monarch-card goals-card" data-widget-card data-widget-id="goals" draggable="true">
      ${cardHeader({ title: 'Goals' })}
      ${emptyState({
        iconName: 'target',
        title: 'Start your first goal',
        description: 'Put your savings to work and start saving up for something great.',
        button: 'Start a goal',
      })}
    </article>
  `;
}

function renderAdviceCard() {
  return `
    <article class="monarch-card advice-card" data-widget-card data-widget-id="advice" draggable="true">
      ${cardHeader({ title: 'Advice', subtitle: 'Prioritized by you' })}
      ${emptyState({
        iconName: 'thumbsUp',
        title: 'Get personalized advice by answering a few questions',
        description: 'Answers to these questions will allow us to personalize financial advice for your household.',
        button: 'Get started',
      })}
    </article>
  `;
}

function renderGettingStartedCard() {
  return `
    <article class="monarch-card getting-started-card" data-widget-card data-widget-id="getting-started" draggable="true">
      ${cardHeader({ title: 'Getting started guide' })}
      ${emptyState({
        iconName: 'flag',
        title: 'Finish setting up Atlas',
        description: 'Connect accounts, review your categories, and personalize your dashboard.',
        button: 'Continue setup',
      })}
    </article>
  `;
}

const widgetRenderers = {
  'getting-started': renderGettingStartedCard,
  budget: renderBudgetCard,
  'credit-score': renderCreditScoreCard,
  'net-worth': renderNetWorthCard,
  goals: renderGoalsCard,
  spending: renderSpendingCard,
  transactions: renderTransactionsCard,
  recurring: renderRecurringCard,
  investments: renderInvestmentsCard,
  advice: renderAdviceCard,
};

function readStoredJson(key, fallback) {
  if (typeof localStorage === 'undefined') return fallback;

  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStoredJson(key, value) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function readWidgetSettings() {
  const defaultOrder = dashboardWidgets.map((widget) => widget.id);
  const storedOrder = readStoredJson(widgetOrderStorageKey, defaultOrder);
  const storedOrderList = Array.isArray(storedOrder) ? storedOrder : defaultOrder;
  const knownIds = new Set(defaultOrder);
  const order = [
    ...storedOrderList.filter((id) => knownIds.has(id)),
    ...defaultOrder.filter((id) => !storedOrderList.includes(id)),
  ];
  const storedVisibility = readStoredJson(widgetVisibilityStorageKey, {});
  const visibility = Object.fromEntries(
    dashboardWidgets.map((widget) => [widget.id, storedVisibility[widget.id] ?? widget.defaultVisible]),
  );

  return { order, visibility };
}

function writeWidgetSettings(settings) {
  writeStoredJson(widgetOrderStorageKey, settings.order);
  writeStoredJson(widgetVisibilityStorageKey, settings.visibility);
}

function renderDashboardCards(settings = readWidgetSettings()) {
  return settings.order
    .filter((id) => settings.visibility[id])
    .map((id) => widgetRenderers[id]?.() ?? '')
    .join('');
}

function renderWidgetToggle(widget, isVisible) {
  return `
    <button
      class="widget-toggle ${isVisible ? 'is-on' : ''}"
      type="button"
      role="switch"
      aria-checked="${isVisible ? 'true' : 'false'}"
      data-widget-toggle="${widget.id}"
    >
      <span></span>
    </button>
  `;
}

function renderCustomizeModal(settings = readWidgetSettings()) {
  const widgetById = new Map(dashboardWidgets.map((widget) => [widget.id, widget]));

  return `
    <div class="customize-modal-shell" data-customize-modal aria-hidden="true">
      <div class="customize-modal-backdrop" data-customize-close></div>
      <section class="customize-modal" role="dialog" aria-modal="true" aria-labelledby="customize-modal-title">
        <header class="customize-modal-header">
          <div>
            <h2 id="customize-modal-title">Customize dashboard</h2>
            <p>Select the widgets you want to see on your dashboard</p>
          </div>
          <button class="customize-modal-close" type="button" aria-label="Close customize dashboard" data-customize-close>
            ${icon('x')}
          </button>
        </header>
        <div class="customize-widget-list" data-customize-widget-list>
          ${settings.order
            .map((id) => widgetById.get(id))
            .filter(Boolean)
            .map(
              (widget) => `
                <div
                  class="customize-widget-row"
                  data-customize-widget-id="${widget.id}"
                  draggable="true"
                >
                  ${widgetDragHandle('Drag widget')}
                  <strong>${widget.name}</strong>
                  ${renderWidgetToggle(widget, settings.visibility[widget.id])}
                </div>
              `,
            )
            .join('')}
        </div>
      </section>
    </div>
  `;
}

export function renderDashboard() {
  const settings = readWidgetSettings();

  return `
    <section class="dashboard-page" data-dashboard-page>
      <section class="dashboard-welcome">
        <h1>${dashboardGreeting()}</h1>
        <button class="dashboard-customize" type="button" data-dashboard-customize>
          ${icon('grid')}
          <span>Customize</span>
        </button>
      </section>

      <section class="monarch-dashboard-grid" aria-label="Dashboard cards" data-dashboard-widget-grid>
        ${renderDashboardCards(settings)}
      </section>
      ${renderCustomizeModal(settings)}
    </section>
  `;
}

function closeDashboardDropdowns(except = null) {
  document.querySelectorAll('[data-dashboard-dropdown]').forEach((dropdown) => {
    if (dropdown === except) return;

    dropdown.classList.remove('is-open');
    dropdown.querySelector('.dashboard-select')?.setAttribute('aria-expanded', 'false');
  });
}

function openCustomizeModal() {
  const modal = document.querySelector('[data-customize-modal]');
  if (!modal) return;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  modal.querySelector('.customize-modal-close')?.focus({ preventScroll: true });
}

function closeCustomizeModal() {
  const modal = document.querySelector('[data-customize-modal]');
  if (!modal) return;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.querySelector('[data-dashboard-customize]')?.focus({ preventScroll: true });
}

function renderDashboardCustomization(settings) {
  const grid = document.querySelector('[data-dashboard-widget-grid]');
  const modal = document.querySelector('[data-customize-modal]');
  const wasOpen = modal?.classList.contains('is-open') ?? false;

  if (grid) grid.innerHTML = renderDashboardCards(settings);
  if (modal) {
    modal.outerHTML = renderCustomizeModal(settings);
    if (wasOpen) openCustomizeModal();
  }
}

function saveAndRenderWidgetSettings(settings) {
  writeWidgetSettings(settings);
  renderDashboardCustomization(settings);
}

function setWidgetVisibility(widgetId, isVisible) {
  const settings = readWidgetSettings();
  settings.visibility[widgetId] = isVisible;
  saveAndRenderWidgetSettings(settings);
}

function reorderWidget(draggedId, targetId, placement = 'before') {
  if (!draggedId || !targetId || draggedId === targetId) return;

  const settings = readWidgetSettings();
  const orderWithoutDragged = settings.order.filter((id) => id !== draggedId);
  const targetIndex = orderWithoutDragged.indexOf(targetId);
  if (targetIndex === -1) return;

  orderWithoutDragged.splice(targetIndex + (placement === 'after' ? 1 : 0), 0, draggedId);
  settings.order = orderWithoutDragged;
  saveAndRenderWidgetSettings(settings);
}

function dragPlacement(event, target) {
  const rect = target.getBoundingClientRect();
  return event.clientY > rect.top + rect.height / 2 ? 'after' : 'before';
}

function updateChartTooltip(point) {
  const chart = point.closest('.atlas-chart');
  const tooltip = chart?.querySelector('.chart-tooltip');
  const marker = chart?.querySelector('.chart-marker');
  const guide = chart?.querySelector('.chart-guide');
  if (!chart || !tooltip || !marker || !guide) return;

  const x = Number(point.dataset.x);
  const y = Number(point.dataset.y);
  marker.setAttribute('cx', x);
  marker.setAttribute('cy', y);
  guide.setAttribute('x1', x);
  guide.setAttribute('x2', x);
  tooltip.querySelector('[data-tooltip-range]').textContent = point.dataset.range;
  tooltip.querySelector('[data-tooltip-value]').textContent = point.dataset.value;
  tooltip.querySelector('[data-tooltip-comparison]').textContent = point.dataset.comparison;

  const svg = chart.querySelector(':scope > svg');
  const viewBox = svg?.viewBox?.baseVal;
  const svgRect = svg?.getBoundingClientRect();
  const chartRect = chart.getBoundingClientRect();
  const scaleX = viewBox?.width && svgRect ? svgRect.width / viewBox.width : 1;
  const scaleY = viewBox?.height && svgRect ? svgRect.height / viewBox.height : 1;
  const pointX = svgRect ? svgRect.left - chartRect.left + x * scaleX : x;
  const pointY = svgRect ? svgRect.top - chartRect.top + y * scaleY : y;

  chart.classList.add('is-hovering');

  const tooltipWidth = Math.min(300, Math.max(chart.clientWidth - 20, 0));
  const tooltipHeight = tooltip.offsetHeight || 112;
  const tooltipHalf = tooltipWidth / 2;
  const tooltipX = Math.min(
    Math.max(pointX, tooltipHalf + 10),
    Math.max(chart.clientWidth - tooltipHalf - 10, tooltipHalf + 10),
  );
  const tooltipY = Math.min(Math.max(pointY - tooltipHeight - 10, 8), Math.max(chart.clientHeight - tooltipHeight - 8, 8));

  chart.style.setProperty('--tooltip-x', `${tooltipX}px`);
  chart.style.setProperty('--tooltip-y', `${tooltipY}px`);
}

if (typeof document !== 'undefined' && !window.__atlasDashboardBound) {
  window.__atlasDashboardBound = true;
  let draggedWidgetId = '';

  document.addEventListener('click', (event) => {
    const customizeButton = event.target.closest('[data-dashboard-customize]');
    const closeCustomizeButton = event.target.closest('[data-customize-close]');
    const widgetToggle = event.target.closest('[data-widget-toggle]');
    const selectButton = event.target.closest('.dashboard-select');
    const menuItem = event.target.closest('.dashboard-menu-item');

    if (customizeButton) {
      openCustomizeModal();
      return;
    }

    if (closeCustomizeButton) {
      closeCustomizeModal();
      return;
    }

    if (widgetToggle) {
      const nextState = widgetToggle.getAttribute('aria-checked') !== 'true';
      setWidgetVisibility(widgetToggle.dataset.widgetToggle, nextState);
      return;
    }

    if (selectButton) {
      const dropdown = selectButton.closest('[data-dashboard-dropdown]');
      const shouldOpen = !dropdown.classList.contains('is-open');
      closeDashboardDropdowns(dropdown);
      dropdown.classList.toggle('is-open', shouldOpen);
      selectButton.setAttribute('aria-expanded', String(shouldOpen));
      if (shouldOpen) dropdown.querySelector('.dashboard-menu')?.focus({ preventScroll: true });
      return;
    }

    if (menuItem) {
      const dropdown = menuItem.closest('[data-dashboard-dropdown]');
      dropdown.querySelector('.dashboard-select span').textContent = menuItem.dataset.dashboardOption;
      dropdown.querySelectorAll('.dashboard-menu-item').forEach((item) => {
        const isActive = item === menuItem;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-selected', String(isActive));
      });
      closeDashboardDropdowns();
      return;
    }

    if (!event.target.closest('[data-dashboard-dropdown]')) {
      closeDashboardDropdowns();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.querySelector('[data-customize-modal].is-open')) {
      closeCustomizeModal();
      return;
    }

    const openDropdown = document.querySelector('[data-dashboard-dropdown].is-open');
    if (!openDropdown) return;

    const items = [...openDropdown.querySelectorAll('.dashboard-menu-item')];
    const currentIndex = items.indexOf(document.activeElement);

    if (event.key === 'Escape') {
      closeDashboardDropdowns();
      openDropdown.querySelector('.dashboard-select')?.focus();
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + direction + items.length) % items.length;
      items[nextIndex]?.focus();
    }
  });

  document.addEventListener('pointerover', (event) => {
    const point = event.target.closest('.chart-hit-point');
    if (point) updateChartTooltip(point);
  });

  document.addEventListener('focusin', (event) => {
    const point = event.target.closest('.chart-hit-point');
    if (point) updateChartTooltip(point);
  });

  document.addEventListener('pointerout', (event) => {
    const chart = event.target.closest('.atlas-chart');
    if (chart && !chart.contains(event.relatedTarget)) {
      chart.classList.remove('is-hovering');
    }
  });

  document.addEventListener('dragstart', (event) => {
    const customizeRow = event.target.closest('[data-customize-widget-id]');
    const dashboardCard = event.target.closest('[data-widget-card]');

    if (dashboardCard && !event.target.closest('.widget-drag-handle')) {
      event.preventDefault();
      return;
    }

    const widgetId = customizeRow?.dataset.customizeWidgetId || dashboardCard?.dataset.widgetId;
    if (!widgetId) return;

    draggedWidgetId = widgetId;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', widgetId);
    (customizeRow || dashboardCard).classList.add('is-dragging');
  });

  document.addEventListener('dragover', (event) => {
    const target = event.target.closest('[data-customize-widget-id], [data-widget-card]');
    if (!target || !draggedWidgetId) return;

    const targetId = target.dataset.customizeWidgetId || target.dataset.widgetId;
    if (!targetId || targetId === draggedWidgetId) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    target.classList.add('is-drag-over');
  });

  document.addEventListener('dragleave', (event) => {
    event.target.closest('[data-customize-widget-id], [data-widget-card]')?.classList.remove('is-drag-over');
  });

  document.addEventListener('drop', (event) => {
    const target = event.target.closest('[data-customize-widget-id], [data-widget-card]');
    if (!target || !draggedWidgetId) return;

    event.preventDefault();
    const targetId = target.dataset.customizeWidgetId || target.dataset.widgetId;
    reorderWidget(draggedWidgetId, targetId, dragPlacement(event, target));
    document.querySelectorAll('.is-dragging, .is-drag-over').forEach((element) => {
      element.classList.remove('is-dragging', 'is-drag-over');
    });
    draggedWidgetId = '';
  });

  document.addEventListener('dragend', () => {
    document.querySelectorAll('.is-dragging, .is-drag-over').forEach((element) => {
      element.classList.remove('is-dragging', 'is-drag-over');
    });
    draggedWidgetId = '';
  });
}
