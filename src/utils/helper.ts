export const formatDate = (val: Date | undefined): string | undefined => {
  if (!val) return undefined;
  // Example format: "08 Oct 2025, 15:30"
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return new Intl.DateTimeFormat("en-US", options).format(val);
};

export const convertToCamelCase = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
