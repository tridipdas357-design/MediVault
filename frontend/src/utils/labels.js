export const RECORD_TYPES = [
  { value: 'PRESCRIPTION', label: 'Prescription' },
  { value: 'LAB_REPORT', label: 'Lab report' },
  { value: 'VACCINATION', label: 'Vaccination' },
  { value: 'CONSULTATION_NOTE', label: 'Consultation note' },
];

export function typeLabel(type) {
  return RECORD_TYPES.find((item) => item.value === type)?.label || type;
}

export function formatDate(value) {
  if (!value) return '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(value) {
  if (!value) return '';
  const [h, m] = value.split(':');
  const date = new Date();
  date.setHours(Number(h), Number(m), 0, 0);
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}
