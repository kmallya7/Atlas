function pointsFromValues(values, width = 520, height = 180, padding = 18) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  return values
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / (values.length - 1 || 1);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');
}

function chartId(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function lineChartCard({ title, subtitle, labels, values, accent = '#315c4d' }) {
  const width = 520;
  const height = 180;
  const points = pointsFromValues(values, width, height);
  const areaPoints = `18,${height - 18} ${points} ${width - 18},${height - 18}`;
  const gradientId = `${chartId(title)}-fill`;

  return `
    <article class="chart-card">
      <div class="card-title-row">
        <div>
          <h3>${title}</h3>
          <p>${subtitle}</p>
        </div>
      </div>
      <svg class="line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">
        <defs>
          <linearGradient id="${gradientId}" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="${accent}" stop-opacity="0.22"></stop>
            <stop offset="100%" stop-color="${accent}" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
        <path d="M18 44 H502 M18 88 H502 M18 132 H502" class="chart-grid"></path>
        <polygon points="${areaPoints}" fill="url(#${gradientId})"></polygon>
        <polyline points="${points}" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
        ${points
          .split(' ')
          .map((point) => {
            const [cx, cy] = point.split(',');
            return `<circle cx="${cx}" cy="${cy}" r="4.5" fill="#fff" stroke="${accent}" stroke-width="3"></circle>`;
          })
          .join('')}
      </svg>
      <div class="chart-labels">
        ${labels.map((label) => `<span>${label}</span>`).join('')}
      </div>
    </article>
  `;
}

export function barChartCard({ title, subtitle, items }) {
  const max = Math.max(...items.map((item) => item.value));

  return `
    <article class="chart-card">
      <div class="card-title-row">
        <div>
          <h3>${title}</h3>
          <p>${subtitle}</p>
        </div>
      </div>
      <div class="bar-chart">
        ${items
          .map(
            (item) => `
              <div class="bar-item">
                <span>${item.label}</span>
                <div class="bar-track">
                  <strong style="width: ${(item.value / max) * 100}%"></strong>
                </div>
                <b>${item.display}</b>
              </div>
            `,
          )
          .join('')}
      </div>
    </article>
  `;
}
