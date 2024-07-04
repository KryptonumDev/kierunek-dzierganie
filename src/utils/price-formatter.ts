export function formatPrice(price: number, min?: number) {
  if (!price) return '0,00 zł';

  if (typeof min == 'number' && price < min) return (min / 100).toFixed(2).replace('.', ',') + ' zł';

  return (price / 100).toFixed(2).replace('.', ',') + ' zł';
}
