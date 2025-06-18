export const getProductBasis = (basis: string, type: string) => {
  if (basis === 'crocheting') {
    if (type === 'product') return '/produkty/szydelkowanie';
    else return '/kursy-szydelkowania';
  } else if (basis === 'knitting') {
    if (type === 'product') return '/produkty/dzierganie';
    else return '/kursy-dziergania-na-drutach';
  } else if (basis === 'other' && type === 'product') {
    return '/produkty/inne';
  } else if (basis === 'instruction' && type === 'product') {
    return '/produkty/instrukcje';
  } else if (basis === 'materials' && type === 'product') {
    return '/produkty/pakiety-materialow';
  }
};
