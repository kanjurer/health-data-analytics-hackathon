export const getFlag = (code: string): string => {
  if (!code || code.length !== 2) return '🏳️'; // fallback: white flag
  return [...code.toUpperCase()]
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');
};

// Variables
export const NATIONALITIES = [
  { name: 'India', code: 'IN' },
  { name: 'France', code: 'FR' },
  { name: 'China', code: 'CN' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Canada', code: 'CA' },
];

export const GENDERS = [
  'Male',
  'Female',
  'Non-binary',
  'Other',
  'Prefer not to say',
] as const;
export const EDUCATION = [
  'No Formal Education',
  'High School',
  'College',
  'Postgraduate',
  'PhD',
] as const;
export const INCOME = ['Low', 'Middle', 'High'] as const;
export const VACCINE_EXPERIENCE = [
  'Positive',
  'Negative',
  'Neutral',
  'None',
] as const;
export const VACCINE_BELIEF = [
  'Supportive',
  'Hesitant',
  'Opposed',
  'Neutral',
] as const;
export const MARITAL = ['Single', 'Married', 'Divorced', 'Widowed'] as const;
export const LOCATION_TYPE = ['Urban', 'Suburban', 'Rural'] as const;
