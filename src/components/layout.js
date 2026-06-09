import { createSidebar, isSidebarCollapsed } from './sidebar.js';

export function createLayout(content, options = {}) {
  return `
    <div class="app-shell ${isSidebarCollapsed() ? 'is-sidebar-collapsed' : ''}">
      ${createSidebar({ user: options.user })}
      <main class="main-content">
        <div class="page-content">
          ${content}
        </div>
      </main>
    </div>
  `;
}
