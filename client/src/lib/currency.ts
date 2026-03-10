export function formatCurrency(value: string): string {
  const digits = value.replace(/[^0-9]/g, "");
  if (digits === "") return "";
  const num = parseInt(digits, 10);
  return "$" + num.toLocaleString("en-US");
}

export function displaySalary(value: string): string {
  if (/^[\$,\s\d]+$/.test(value)) {
    return formatCurrency(value);
  }
  return value;
}
