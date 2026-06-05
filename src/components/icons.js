const iconPaths = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="3" width="7" height="7" rx="1.5"></rect><rect x="3" y="14" width="7" height="7" rx="1.5"></rect><rect x="14" y="14" width="7" height="7" rx="1.5"></rect>',
  wallet: '<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 16.5z"></path><path d="M17 12h3v4h-3a2 2 0 0 1 0-4z"></path><path d="M7 5V3.8L17 6"></path>',
  swap: '<path d="M7 7h11l-3-3"></path><path d="M18 7l-3 3"></path><path d="M17 17H6l3 3"></path><path d="M6 17l3-3"></path>',
  target: '<circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="4"></circle><path d="M12 8v4l3 2"></path>',
  flag: '<path d="M6 21V4"></path><path d="M6 5h11l-1.5 4L17 13H6"></path>',
  chart: '<path d="M4 19V5"></path><path d="M4 19h16"></path><path d="M7 15l3-4 3 2 5-7"></path>',
  gear: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.04.04a2 2 0 0 1-2.83 2.83l-.04-.04A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 0 1-4 0v-.08A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.04.04a2 2 0 0 1-2.83-2.83l.04-.04A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2.8a2 2 0 0 1 0-4h.08A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.04-.04a2 2 0 0 1 2.83-2.83l.04.04A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V2.8a2 2 0 0 1 4 0v.08A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.04-.04a2 2 0 0 1 2.83 2.83l-.04.04A1.7 1.7 0 0 0 19.4 9c.36.36.72.55 1.1.6h.7a2 2 0 0 1 0 4h-.08a1.7 1.7 0 0 0-1.72 1.4z"></path>',
  search: '<path d="m21 21-4.35-4.35"></path><circle cx="11" cy="11" r="7"></circle>',
  plus: '<path d="M12 5v14"></path><path d="M5 12h14"></path>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"></rect><path d="M16 3v4"></path><path d="M8 3v4"></path><path d="M3 10h18"></path>',
  dots: '<circle cx="5" cy="12" r="1.6"></circle><circle cx="12" cy="12" r="1.6"></circle><circle cx="19" cy="12" r="1.6"></circle>',
};

export function icon(name, className = 'icon') {
  return `
    <svg class="${className}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      ${iconPaths[name] || iconPaths.grid}
    </svg>
  `;
}
