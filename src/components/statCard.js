export function statCard({ label, value, note, trend, tone = 'neutral' }) {
  return `
    <article class="stat-card tone-${tone}">
      <div>
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
      <p>${note}</p>
      ${trend ? `<small>${trend}</small>` : ''}
    </article>
  `;
}
