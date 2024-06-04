export function formatPrice(price: number, min?: number) {
  if (!price) return 'Darmowe';

  if (typeof min == 'number' && price < min) return (min / 100).toFixed(2).replace('.', ',') + ' zł';

  return (price / 100).toFixed(2).replace('.', ',') + ' zł';
}
