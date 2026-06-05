import { createHeader } from './header.js';
import { createSidebar } from './sidebar.js';

export function createLayout(content) {
  return `
    <div class="app-shell">
      ${createSidebar()}
      <main class="main-content">
        ${createHeader()}
        <div class="page-content">
          ${content}
        </div>
      </main>
    </div>
  `;
}
