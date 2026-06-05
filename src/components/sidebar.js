import { sidebarItems } from '../lib/navigation.js';
import { icon } from './icons.js';

function currentPath() {
  return window.location.hash.replace('#', '') || window.location.pathname || '/dashboard';
}

export function createSidebar(pathname = currentPath()) {
  return `
    <aside class="sidebar" aria-label="Primary navigation">
      <a class="brand" href="#/dashboard" data-link>
        <span class="brand-mark">A</span>
        <span>
          <strong>Atlas</strong>
          <small>Personal finance</small>
        </span>
      </a>

      <nav class="nav-list">
        ${sidebarItems
          .map((item) => {
            const active = pathname === item.path || (pathname === '/' && item.path === '/dashboard');
            return `
              <a class="nav-item ${active ? 'is-active' : ''}" href="${item.href}" data-link>
                ${icon(item.icon)}
                <span>${item.label}</span>
              </a>
            `;
          })
          .join('')}
      </nav>

      <section class="sidebar-summary">
        <p>June snapshot</p>
        <strong>₹38.4L</strong>
        <span>Net worth is up 7.4% this year</span>
      </section>
    </aside>
  `;
}
