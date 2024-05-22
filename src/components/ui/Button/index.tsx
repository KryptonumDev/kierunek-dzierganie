import Link from 'next/link';
import styles from './styles.module.scss';
import isExternalLink from '@/utils/is-external-link';
import type { CtaType } from '@/global/types';

type ButtonProps = (
  | {
      data: CtaType;
      href?: never;
      children?: never;
    }
  | {
      data?: never;
      href?: CtaType['href'];
      children: CtaType['text'];
      disabled?: boolean;
    }
) &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

const Button = ({ data, children, href, className, ...props }: ButtonProps) => {
  if (data) {
    href = data.href;
    children = data.text;
  }

  const isExternal = isExternalLink(href);
  const Element: 'a' | typeof Link | 'button' = href ? (isExternal ? 'a' : Link) : 'button';

  return (
    <Element
      href={href || ''}
      {...(href && isExternal && { target: '_blank', rel: 'noopener' })}
      className={`${styles.wrapper}${className ? ` ${className}` : ''}`}
      {...props}
    >
      <Arrow />
      <Ellipse />
      <span>{children}</span>
      <Arrow />
    </Element>
  );
};

const Ellipse = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={50}
    height={55}
    fill='none'
  >
    <path
      d='M49.691 13.437c-4.25-7.25-18.94-18.375-36.316-8.375C7.871 8.625-1.455 17.262.684 31.687 3 47.313 15.339 53.19 22.809 54.376c7.002 1.111 17.125 0 24.25-8.438'
      stroke='#53423C'
      strokeWidth={0.5}
    />
  </svg>
);

const Arrow = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='23'
    height='10'
    fill='none'
    className={styles.arrow}
  >
    <path
      stroke='#53423C'
      strokeWidth='0.75'
      d='M.534 5h21.812m0 0l-3.75-3.75M22.346 5l-3.75 3.75'
    ></path>
  </svg>
);

export default Button;

export const CtaQuery = `
  text,
  href,
`;
