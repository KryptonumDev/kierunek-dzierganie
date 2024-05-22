import { isPreviewDeployment } from '@/utils/is-preview-deployment';
import styles from './PreviewDeploymentInfo.module.scss';

const PreviewDeploymentInfo = () => {
  if (!isPreviewDeployment) return;

  return (
    <p className={styles['PreviewDeploymentInfo']}>
      <InfoIcon />
      <span>Preview environment is enabled.</span>
    </p>
  );
};

export default PreviewDeploymentInfo;

const InfoIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 512 512'
    width={18}
    height={18}
    fill='none'
    stroke='currentColor'
    strokeWidth={32}
  >
    <path
      d='M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184 184-82.39 184-184S349.61 64 248 64z'
      strokeMiterlimit={10}
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M220 220h32v116'
    />
    <path
      strokeLinecap='round'
      strokeMiterlimit={10}
      d='M208 340h88'
    />
    <path d='M248 130a26 26 0 1 0 26 26 26 26 0 0 0-26-26z' />
  </svg>
);
