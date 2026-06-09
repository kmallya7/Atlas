import { initRouter, renderApp } from './routes/router.js';

const savedTheme = localStorage.getItem('atlas-theme') || 'dark';
document.documentElement.dataset.theme = savedTheme === 'light' ? 'light' : 'dark';
document.documentElement.dataset.atlasTheme = document.documentElement.dataset.theme;

initRouter();
renderApp();
