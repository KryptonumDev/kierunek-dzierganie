import styles from './CtaHeading.module.scss';
import type { CtaHeadingTypes } from './CtaHeading.types';

const CtaHeading = ({ heading, paragraph, cta, additionalText }: CtaHeadingTypes) => {
  return <section className={styles['CtaHeading']}></section>;
};

export default CtaHeading;
