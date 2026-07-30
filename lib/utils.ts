import dayjs from "dayjs";

export const formatCurrency = (
  value: number,
  _currency = "IRR"
): string => {
  try {
    const formatted = new Intl.NumberFormat("fa-IR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

    return `${formatted} تومان`;
  } catch {
    return `${value.toLocaleString("fa-IR")} تومان`;
  }
};

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};