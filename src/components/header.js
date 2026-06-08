import { icon } from './icons.js';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function userInitials(user) {
  const source = user?.name || user?.email || 'Atlas user';
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function renderUserAvatar(user) {
  if (user?.avatarUrl) {
    return `<img src="${escapeHtml(user.avatarUrl)}" alt="" />`;
  }

  return `<span>${escapeHtml(userInitials(user))}</span>`;
}

export function createHeader(user) {
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
        <div class="header-user">
          <button class="avatar-button" type="button" aria-label="Signed in profile">
            ${renderUserAvatar(user)}
          </button>
          <div class="header-user-copy">
            <strong>${escapeHtml(user?.name || 'Atlas user')}</strong>
            <span>${escapeHtml(user?.email || 'Signed in')}</span>
          </div>
        </div>
        <button class="secondary-button" type="button" data-auth-action="sign-out">
          <span>Sign out</span>
        </button>
      </div>
    </header>
  `;
}
