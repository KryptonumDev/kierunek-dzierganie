import React from 'react';

const styles = {
  display: 'block',
  padding: '10px',
};

function LandingPageSlug(props) {
  const { renderDefault, value } = props;
  const slugValue = value?.current;

  return (
    <>
      <div style={{ flex: 1 }}>{renderDefault(props)}</div>
      {slugValue && (
        <a target="_blank" href={`https://kierunekdzierganie.pl/landing/${slugValue}`} style={styles}>
          Link do landingu
        </a>
      )}
    </>
  );
}

export default LandingPageSlug;
