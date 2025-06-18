import React from 'react';
import { useFormValue } from 'sanity';

const styles = {
  display: 'block',
  padding: '10px',
};

const courseUrls: { knitting: string; crocheting: string } = {
  knitting: '/kursy-dziergania-na-drutach',
  crocheting: '/kursy-szydelkowania',
};

function CourseSlug(props) {
  const { renderDefault, value } = props;
  const basisValue = useFormValue([`basis`]) as string;
  return (
    <>
      <div style={{ flex: 1 }}>{renderDefault(props)}</div>
      {basisValue && value && (
        <a
          target='_blank'
          href={`https://kierunekdzierganie.pl${courseUrls[basisValue]}/${value.current}`}
          style={styles}
        >
          Link do kursu
        </a>
      )}
    </>
  );
}

export default CourseSlug;
