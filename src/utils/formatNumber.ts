export const formatNumber = (value?: number): string => {
  return new Intl.NumberFormat("vi-VN").format(value||0);
};

export const formatMatic = (value?: number | string | null, maxDecimals: number = 4): string => {
  if (value === undefined || value === null) return '0';
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(num)) return '0';
  
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  }).format(num);
};