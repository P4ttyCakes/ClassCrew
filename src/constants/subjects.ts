// Subject theming: deterministic color per department prefix (e.g., EECS, MATH, ECON)

export type SubjectTheme = {
  gradient: [string, string]; // same color twice to render solid
  tint: string; // primary color
};

// Pool of solid, aesthetic colors (duplicated in gradient to appear solid)
const SOLID_COLORS: string[] = [
  '#1E3A8A', // dark indigo
  '#0EA5E9', // sky
  '#10B981', // emerald
  '#84CC16', // lime
  '#F59E0B', // amber
  '#EF4444', // red
  '#EC4899', // pink
  '#8B5CF6', // violet
  '#F97316', // orange
  '#14B8A6', // teal
  '#06B6D4', // cyan
  '#22C55E', // green
  '#A855F7', // purple
  '#3B82F6', // blue
  '#D946EF', // fuchsia
  '#E11D48', // rose
];

// Specific department overrides
const OVERRIDES: Record<string, [string, string]> = {
  // EECS: dark solid blue
  EECS: ['#1E3A8A', '#1E3A8A'],
};

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0; // 32-bit
  }
  return Math.abs(h);
}

// Extract department prefix from a class code or title.
// e.g., "EECS 280 Study Session" → "EECS"
export function extractDepartment(value: string): string | null {
  if (!value) return null;
  // Match leading uppercase letters (allow digits after space)
  const m = value.trim().match(/^([A-Z]{2,})\b/);
  if (m && m[1]) return m[1];
  // Also try patterns like "EECS 280" inside the string
  const m2 = value.toUpperCase().match(/\b([A-Z]{2,})\s*\d{2,}\b/);
  if (m2 && m2[1]) return m2[1];
  return null;
}

export function getThemeForString(value: string, fallback: SubjectTheme = { gradient: ['#8B5CF6', '#6366F1'], tint: '#8B5CF6' }): SubjectTheme {
  const dep = (value || 'DEFAULT').toUpperCase();
  if (OVERRIDES[dep]) {
    const gradient = OVERRIDES[dep];
    return { gradient, tint: gradient[0] };
  }
  const idx = hashString(dep) % SOLID_COLORS.length;
  const color = SOLID_COLORS[idx];
  const gradient: [string, string] = [color, color];
  return { gradient, tint: gradient[0] };
}

// Subject → emoji aesthetic mapping
const SUBJECT_EMOJI: Record<string, string> = {
  EECS: '💻',
  MATH: '➗',
  CHEM: '🧪',
  PHYSICS: '🔭',
  STATS: '📊',
  ECON: '💹',
  ENGLISH: '📚',
  HIST: '🏛️',
  BIOLOGY: '🧬',
  PSYCH: '🧠',
  NURS: '🩺',
  ARTDES: '🎨',
  MUSICOL: '🎼',
  DANCE: '💃',
  AEROSP: '✈️',
  MECHENG: '⚙️',
  CEE: '🏗️',
  BME: '🦾',
  ROB: '🤖',
  SI: '🗂️',
  FIN: '💵',
  STRATEGY: '♟️',
  POLSCI: '🏛️',
  COMM: '🗣️',
  PUBPOL: '📜',
  CHE: '🧪',
  ACC: '🧾',
  BA: '📈',
  PHIL: '🗿',
  ASTRO: '🌌',
  EARTH: '🌎',
  ORGSTUD: '👥',
  MCDB: '🧬',
  EEB: '🌿',
  PHARMSCI: '💊',
  EPID: '🧫',
  RCHUMS: '📝',
  ASIANLAN: '🈴',
  MEMS: '🛠️',
  CLARCH: '🏺',
  NERS: '☢️',
  MSE: '🧱',
  IOE: '🛠️',
  ENGR: '🧰',
};

export function getEmojiForSubject(value: string): string {
  const dep = (value || '').toUpperCase();
  return SUBJECT_EMOJI[dep] || '📘';
}


