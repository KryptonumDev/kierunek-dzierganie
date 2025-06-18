import React from 'react';
import { useFormValue } from 'sanity';

const styles = {
  display: 'block',
  padding: '10px',
};

const productUrls: { knitting: string; crocheting: string; other: string; instruction: string; materials: string } = {
  knitting: '/produkty/dzierganie',
  crocheting: '/produkty/szydelkowanie',
  other: '/produkty/inne',
  instruction: '/produkty/instrukcje',
  materials: '/produkty/pakiety-materialow',
};

function ProductSlug(props) {
  const { renderDefault, value } = props;
  const basisValue = useFormValue([`basis`]) as string;
  return (
    <>
      <div style={{ flex: 1 }}>{renderDefault(props)}</div>
      {basisValue && value && (
        <a
          target='_blank'
          href={`https://kierunekdzierganie.pl${productUrls[basisValue]}/${value.current}`}
          style={styles}
        >
          Link do produktu
        </a>
      )}
    </>
  );
}

export default ProductSlug;
