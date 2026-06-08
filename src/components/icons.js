const iconPaths = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="3" width="7" height="7" rx="1.5"></rect><rect x="3" y="14" width="7" height="7" rx="1.5"></rect><rect x="14" y="14" width="7" height="7" rx="1.5"></rect>',
  home: '<path d="m3 10.5 9-7 9 7"></path><path d="M5 9.5V20h14V9.5"></path><path d="M9 20v-6h6v6"></path>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5z"></path><path d="m3 12 9 5 9-5"></path><path d="m3 16 9 5 9-5"></path>',
  wallet: '<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 16.5z"></path><path d="M17 12h3v4h-3a2 2 0 0 1 0-4z"></path><path d="M7 5V3.8L17 6"></path>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18"></path>',
  swap: '<path d="M7 7h11l-3-3"></path><path d="M18 7l-3 3"></path><path d="M17 17H6l3 3"></path><path d="M6 17l3-3"></path>',
  bars: '<path d="M5 20V10"></path><path d="M12 20V4"></path><path d="M19 20v-7"></path>',
  target: '<circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="4"></circle><path d="M12 8v4l3 2"></path>',
  flag: '<path d="M6 21V4"></path><path d="M6 5h11l-1.5 4L17 13H6"></path>',
  chart: '<path d="M4 19V5"></path><path d="M4 19h16"></path><path d="M7 15l3-4 3 2 5-7"></path>',
  pie: '<path d="M21 12a9 9 0 1 1-9-9v9z"></path><path d="M12 3a9 9 0 0 1 9 9h-9z"></path>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6z"></path><path d="M9 3v15"></path><path d="M15 6v15"></path>',
  gear: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.04.04a2 2 0 0 1-2.83 2.83l-.04-.04A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 0 1-4 0v-.08A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.04.04a2 2 0 0 1-2.83-2.83l.04-.04A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2.8a2 2 0 0 1 0-4h.08A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.04-.04a2 2 0 0 1 2.83-2.83l.04.04A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V2.8a2 2 0 0 1 4 0v.08A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.04-.04a2 2 0 0 1 2.83 2.83l-.04.04A1.7 1.7 0 0 0 19.4 9c.36.36.72.55 1.1.6h.7a2 2 0 0 1 0 4h-.08a1.7 1.7 0 0 0-1.72 1.4z"></path>',
  search: '<path d="m21 21-4.35-4.35"></path><circle cx="11" cy="11" r="7"></circle>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path>',
  panel: '<rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M10 4v16"></path>',
  panelRight: '<rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M14 4v16"></path>',
  menu: '<path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path>',
  chevronDown: '<path d="m6 9 6 6 6-6"></path>',
  chevronUp: '<path d="m18 15-6-6-6 6"></path>',
  sun: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>',
  moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 7 7 0 1 0 20.5 14.5z"></path>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"></path>',
  x: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
  logOut: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><path d="M16 17l5-5-5-5"></path><path d="M21 12H9"></path>',
  trend: '<path d="m3 17 6-6 4 4 7-8"></path><path d="M14 7h6v6"></path>',
  compass: '<circle cx="12" cy="12" r="9"></circle><path d="m15.5 8.5-2 5-5 2 2-5 5-2z"></path>',
  thumbsUp: '<path d="M7 10v11"></path><path d="M15 5.5 14 10h5.5a2 2 0 0 1 1.94 2.48l-1.4 5.6A4 4 0 0 1 16.16 21H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h2.28a2 2 0 0 0 1.79-1.1L13 5a1.2 1.2 0 0 1 2 .5z"></path>',
  plus: '<path d="M12 5v14"></path><path d="M5 12h14"></path>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"></rect><path d="M16 3v4"></path><path d="M8 3v4"></path><path d="M3 10h18"></path>',
  dots: '<circle cx="5" cy="12" r="1.6"></circle><circle cx="12" cy="12" r="1.6"></circle><circle cx="19" cy="12" r="1.6"></circle>',
  google: '<path d="M21.35 11.1h-9.18v2.92h5.28a4.52 4.52 0 0 1-1.96 2.97v2.42h3.17c1.86-1.7 2.94-4.2 2.94-7.16 0-.4-.03-.78-.1-1.15z"></path><path d="M12.17 21.5c2.65 0 4.88-.86 6.5-2.34l-3.17-2.42c-.88.58-2 .92-3.33.92-2.56 0-4.73-1.7-5.5-3.99H3.4v2.5a9.83 9.83 0 0 0 8.77 5.33z"></path><path d="M6.67 13.67a5.7 5.7 0 0 1 0-3.64v-2.5H3.4a9.67 9.67 0 0 0 0 8.64z"></path><path d="M12.17 6.04c1.44 0 2.74.49 3.76 1.45l2.81-2.77A9.56 9.56 0 0 0 12.17 2 9.83 9.83 0 0 0 3.4 7.53l3.27 2.5c.77-2.29 2.94-3.99 5.5-3.99z"></path>',
};

export function icon(name, className = 'icon') {
  return `
    <svg class="${className}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      ${iconPaths[name] || iconPaths.grid}
    </svg>
  `;
}
