export function formatPrice(price: number) {
  if (!price) return 'Darmowe';
  return (price / 100).toFixed(2).replace('.', ',') + ' zł';
}
