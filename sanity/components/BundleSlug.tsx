import React from 'react';
import { useFormValue } from 'sanity';

const styles = {
  display: 'block',
  padding: '10px',
};

const bundleUrls: { knitting: string; crocheting: string } = {
  knitting: '/kursy-dziergania-na-drutach',
  crocheting: '/kursy-szydelkowania',
};

function BundleSlug(props) {
  const { renderDefault, value } = props;
  const basisValue = useFormValue([`basis`]) as string;
  const slugValue = value?.current;

  return (
    <>
      <div style={{ flex: 1 }}>{renderDefault(props)}</div>
      {basisValue && slugValue && (
        <a
          target="_blank"
          href={`https://kierunekdzierganie.pl${bundleUrls[basisValue]}/${slugValue}`}
          style={styles}
        >
          Link do pakietu
        </a>
      )}
    </>
  );
}

export default BundleSlug;
