import { icon } from './icons.js';

export function createHeader() {
  return `
    <header class="top-header">
      <label class="search-box">
        ${icon('search')}
        <input type="search" placeholder="Search transactions, accounts, merchants" />
      </label>

      <div class="header-actions">
        <button class="date-filter" type="button">
          ${icon('calendar')}
          <span>Jun 2026</span>
        </button>
        <button class="primary-action" type="button">
          ${icon('plus')}
          <span>Add transaction</span>
        </button>
        <button class="avatar-button" type="button" aria-label="Open profile">
          <span>KM</span>
        </button>
      </div>
    </header>
  `;
}
