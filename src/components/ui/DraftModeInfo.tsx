const DraftModeInfo = () => (
  <p
    style={{
      backgroundColor: 'rgba(0,0,0,.62)',
      color: 'rgba(255,255,255,.8)',
      padding: '8px 16px',
      backdropFilter: 'blur(8px)',
      borderRadius: '8px',
      position: 'fixed',
      right: 5,
      bottom: 5,
      fontSize: '0.8125rem',
      zIndex: '99',
    }}
  >
    Draft mode is enabled
  </p>
);

export default DraftModeInfo;
