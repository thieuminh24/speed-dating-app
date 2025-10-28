export const dayOptions = Array.from({ length: 31 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}));

export const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}));

const currentYear = new Date().getFullYear();
export const yearOptions = Array.from(
  { length: currentYear - 1970 + 1 },
  (_, i) => {
    const year = 1970 + i;
    return { label: String(year), value: String(year) };
  },
);
