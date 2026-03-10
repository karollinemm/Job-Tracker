export function getRelativeAge(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "In the future";
  if (diffDays === 0) return "Added today";
  if (diffDays === 1) return "Added 1 day ago";
  if (diffDays < 30) return `Added ${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "Added 1 month ago";
  return `Added ${diffMonths} months ago`;
}

export function toDateInputValue(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
