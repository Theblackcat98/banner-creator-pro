import { BannerSettings, HorizontalAlignment, VerticalAlignment } from './types';

export const HORIZONTAL_ALIGN_OPTIONS: { value: HorizontalAlignment; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'center',label: 'Center' },
  { value: 'right', label: 'Right' },
];

export const VERTICAL_ALIGN_OPTIONS: { value: VerticalAlignment; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'middle', label: 'Middle' },
  { value: 'bottom', label: 'Bottom' },
];

export const PREDEFINED_ICONS: Record<string, string> = {
  none: '',
  star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
  circle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z"/></svg>`,
  react: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor"><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`,
};

export const DEFAULT_BANNER_SETTINGS: BannerSettings = {
  width: 1200,
  height: 630,
  backgroundColor: '#161b22', // GitHub panel dark grey
  cornerRadius: 12,
  outlineColor: '#58a6ff', // GitHub blue
  outlineThickness: 8,
  fontFamily: 'Roboto',
  fontSize: 72,
  fontColor: '#e6edf3', // GitHub light text
  text: 'Hello World!\nWelcome to the Banner Creator.',
  textAlign: 'center',
  verticalAlign: 'middle',
  icon: 'none',
  uploadedIconSvg: null,
  theme: 'default',
  windowTitle: 'bash',
};