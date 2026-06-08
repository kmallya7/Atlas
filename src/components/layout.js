import { createHeader } from './header.js';
import { createSidebar, isSidebarCollapsed } from './sidebar.js';

export function createLayout(content, options = {}) {
  return `
    <div class="app-shell ${isSidebarCollapsed() ? 'is-sidebar-collapsed' : ''}">
      ${createSidebar({ user: options.user })}
      <main class="main-content">
        ${createHeader(options.user)}
        <div class="page-content">
          ${content}
        </div>
      </main>
    </div>
  `;
}
