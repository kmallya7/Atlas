import { sidebarItems } from '../lib/navigation.js';
import { icon } from './icons.js';

const collapseStorageKey = 'atlas-sidebar-collapsed';
const themeStorageKey = 'atlas-theme';
let profileMenuOpen = false;
let whatsNewOpen = false;
let lastSidebarUser = null;

function currentPath() {
  return window.location.hash.replace('#', '') || window.location.pathname || '/dashboard';
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function readCollapsedState() {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(collapseStorageKey) === 'true';
}

function saveCollapsedState(isCollapsed) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(collapseStorageKey, String(isCollapsed));
}

function readTheme() {
  if (typeof localStorage === 'undefined') return 'dark';
  return localStorage.getItem(themeStorageKey) || 'dark';
}

function saveTheme(theme) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(themeStorageKey, theme);
}

function applyTheme(theme = readTheme()) {
  if (typeof document === 'undefined') return;
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.dataset.atlasTheme = nextTheme;
}

function userInitials(user) {
  const source = user?.name || user?.displayName || user?.email || 'Karthick';
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function renderSidebarAvatar(user) {
  const avatarUrl = user?.avatarUrl || user?.photoURL || '';
  const initials = `<span>${escapeHtml(userInitials(user))}</span>`;

  if (avatarUrl) {
    return `${initials}<img src="${escapeHtml(avatarUrl)}" alt="" referrerpolicy="no-referrer" onerror="this.remove()" />`;
  }

  return initials;
}

function renderTopActions(isCollapsed) {
  return `
    <div class="sidebar-actions" aria-label="Sidebar tools">
      <button class="sidebar-icon-button" type="button" aria-label="Search">${icon('search')}</button>
      <button class="sidebar-icon-button" type="button" aria-label="Notifications">${icon('bell')}</button>
      <a class="sidebar-icon-button" href="#/settings" data-link aria-label="Settings">${icon('gear')}</a>
      <button class="sidebar-icon-button" type="button" data-sidebar-action="toggle-collapse" aria-label="${isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}" aria-pressed="${isCollapsed}">
        ${icon('panel')}
      </button>
    </div>
  `;
}

function renderProfileMenu() {
  const theme = readTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const themeLabel = theme === 'dark' ? 'Light mode' : 'Dark mode';
  const themeIcon = theme === 'dark' ? 'sun' : 'moon';

  return `
    <div class="sidebar-profile-menu ${profileMenuOpen ? 'is-open' : ''}" id="sidebar-profile-menu" role="menu">
      <button type="button" role="menuitem" data-sidebar-action="toggle-theme" data-theme-value="${nextTheme}">${icon(themeIcon)}<span>${themeLabel}</span></button>
      <button type="button" role="menuitem" data-sidebar-action="open-whats-new">${icon('zap')}<span>What's new</span></button>
      <a href="#/settings" data-link role="menuitem">${icon('gear')}<span>Settings</span></a>
      <button class="is-danger" type="button" data-auth-action="sign-out" role="menuitem">${icon('logOut')}<span>Sign out</span></button>
    </div>
  `;
}

function renderWhatsNewModal() {
  if (!whatsNewOpen) return '';

  return `
    <div class="sidebar-modal-backdrop" data-sidebar-action="close-whats-new">
      <section class="sidebar-modal" role="dialog" aria-modal="true" aria-labelledby="sidebar-whats-new-title">
        <div class="sidebar-modal-header">
          <h2 id="sidebar-whats-new-title">What's new in Atlas</h2>
          <button class="sidebar-modal-close" type="button" data-sidebar-action="close-whats-new" aria-label="Close what's new">
            ${icon('x')}
          </button>
        </div>
        <p>Sidebar rebuilt, cleaner navigation, profile menu, theme toggle.</p>
      </section>
    </div>
  `;
}

export function isSidebarCollapsed() {
  return readCollapsedState();
}

export function createSidebar(options = {}) {
  const pathname = options.pathname || currentPath();
  const user = options.user || {};
  const isCollapsed = readCollapsedState();
  const displayName = user.name || user.displayName || 'Karthick';

  lastSidebarUser = user;
  applyTheme();

  return `
    <aside class="sidebar ${isCollapsed ? 'is-collapsed' : ''}" aria-label="Primary navigation">
      <div class="sidebar-top">
        <a class="brand" href="#/dashboard" data-link aria-label="Atlas dashboard">
          <span class="brand-mark">A</span>
        </a>
        ${renderTopActions(isCollapsed)}
      </div>

      <nav class="nav-list">
        ${sidebarItems
          .map((item) => {
            const active = pathname === item.path || (pathname === '/' && item.path === '/dashboard');
            return `
              <a class="nav-item ${active ? 'is-active' : ''}" href="${item.href}" data-link title="${escapeHtml(item.label)}" ${active ? 'aria-current="page"' : ''}>
                ${icon(item.icon)}
                <span class="nav-label">${escapeHtml(item.label)}</span>
              </a>
            `;
          })
          .join('')}
      </nav>

      <div class="sidebar-profile">
        ${renderProfileMenu()}
        <button class="sidebar-profile-button" type="button" data-sidebar-action="toggle-profile-menu" aria-expanded="${profileMenuOpen}" aria-controls="sidebar-profile-menu">
          <span class="sidebar-avatar">${renderSidebarAvatar(user)}</span>
          <span class="sidebar-profile-name">${escapeHtml(displayName)}</span>
          ${icon(profileMenuOpen ? 'chevronUp' : 'chevronDown', 'icon sidebar-chevron')}
        </button>
      </div>
    </aside>
    ${renderWhatsNewModal()}
  `;
}

function setSidebarCollapsed(isCollapsed) {
  saveCollapsedState(isCollapsed);
  document.querySelector('.app-shell')?.classList.toggle('is-sidebar-collapsed', isCollapsed);
  const sidebar = document.querySelector('.sidebar');
  sidebar?.classList.toggle('is-collapsed', isCollapsed);
  const toggleButton = document.querySelector('[data-sidebar-action="toggle-collapse"]');
  toggleButton?.setAttribute('aria-pressed', String(isCollapsed));
  toggleButton?.setAttribute('aria-label', isCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
}

function refreshSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const shell = document.querySelector('.app-shell');
  const isCollapsed = readCollapsedState();

  sidebar.outerHTML = createSidebar({ user: lastSidebarUser || {}, pathname: currentPath() });
  shell?.classList.toggle('is-sidebar-collapsed', isCollapsed);
}

function refreshSidebarChrome() {
  const shell = document.querySelector('.app-shell');
  if (!shell) return;

  const sidebar = document.querySelector('.sidebar');
  const modal = document.querySelector('.sidebar-modal-backdrop');
  const isCollapsed = readCollapsedState();
  const nextMarkup = createSidebar({ user: lastSidebarUser || {}, pathname: currentPath() });
  const container = document.createElement('div');

  container.innerHTML = nextMarkup;
  sidebar?.replaceWith(container.querySelector('.sidebar'));

  if (modal) modal.remove();
  const nextModal = container.querySelector('.sidebar-modal-backdrop');
  if (nextModal) shell.append(nextModal);

  shell.classList.toggle('is-sidebar-collapsed', isCollapsed);
}

if (typeof document !== 'undefined' && !window.__atlasSidebarBound) {
  window.__atlasSidebarBound = true;
  applyTheme();

  document.addEventListener('click', (event) => {
    const sidebarAction = event.target.closest('[data-sidebar-action]');
    const clickedInsideProfile = event.target.closest('.sidebar-profile');
    const clickedInsideModal = event.target.closest('.sidebar-modal');

    if (!clickedInsideProfile && profileMenuOpen) {
      profileMenuOpen = false;
      refreshSidebarChrome();
    }

    if (!sidebarAction) return;

    const action = sidebarAction.dataset.sidebarAction;

    if (action === 'toggle-collapse') {
      event.preventDefault();
      profileMenuOpen = false;
      whatsNewOpen = false;
      setSidebarCollapsed(!readCollapsedState());
    }

    if (action === 'toggle-profile-menu') {
      event.preventDefault();
      profileMenuOpen = !profileMenuOpen;
      refreshSidebarChrome();
    }

    if (action === 'toggle-theme') {
      event.preventDefault();
      const nextTheme = sidebarAction.dataset.themeValue || 'light';
      saveTheme(nextTheme);
      applyTheme(nextTheme);
      profileMenuOpen = true;
      refreshSidebarChrome();
    }

    if (action === 'open-whats-new') {
      event.preventDefault();
      profileMenuOpen = false;
      whatsNewOpen = true;
      refreshSidebarChrome();
    }

    if (action === 'close-whats-new') {
      if (clickedInsideModal && sidebarAction.classList.contains('sidebar-modal-backdrop')) return;
      event.preventDefault();
      whatsNewOpen = false;
      refreshSidebarChrome();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    if (profileMenuOpen || whatsNewOpen) {
      profileMenuOpen = false;
      whatsNewOpen = false;
      refreshSidebarChrome();
    }
  });
}
