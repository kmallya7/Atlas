export function progressCard({ title, subtitle, current, target, percent, meta, tone = 'green' }) {
  return `
    <article class="progress-card tone-${tone}">
      <div class="card-title-row">
        <div>
          <h3>${title}</h3>
          ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
        <strong>${percent}%</strong>
      </div>
      <div class="progress-track" aria-label="${title} progress">
        <span style="width: ${Math.min(percent, 100)}%"></span>
      </div>
      <div class="progress-meta">
        <span>${current}</span>
        <span>${target}</span>
      </div>
      ${meta ? `<small>${meta}</small>` : ''}
    </article>
  `;
}
