import Link from 'next/link';
import styles from './styles.module.scss';
import type { CtaType } from '@/global/types';
import isExternalLink from '@/utils/is-external-link';

type ButtonProps = (
  | {
    data: CtaType;
    theme?: never;
    href?: never;
    children?: never;
  } | {
    data?: never;
    theme: CtaType['theme'],
    href?: CtaType['href'],
    children: CtaType['text']
  }
) & React.HTMLAttributes<HTMLAnchorElement | HTMLButtonElement>;

const Button = ({ data, theme = 'primary', children, href, className, ...props }: ButtonProps) => {
  if(data){
    theme = data.theme;
    href = data.href;
    children = data.text;
  }

  const isExternal = isExternalLink(href);
  const Element: 'a' | typeof Link | 'button' = href ? (isExternal ? 'a' : Link) : 'button';

  return (
    <Element
      href={href || ''}
      {...(href ? {
        ...(isExternal && { target: '_blank', rel: 'noopener' }),
      } : {
        type: 'submit'
      })}
      data-theme={theme}
      className={`${styles.wrapper}${className ? ` ${className}` : ''}`}
      {...props}
    >
      <Arrow />
      <Ellipse />
      <span>
        {children}
      </span>
      <Arrow />
    </Element>
  );
};

const Ellipse = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='51' height='54' fill='none' className={styles.ellipse}>
    <mask id='a' fill='#fff'>
      <path d='M47.78 45.124a27 27 0 112.706-32.714l-.383.246a26.545 26.545 0 10-2.66 32.162l.337.306z'></path>
    </mask>
    <path
      stroke='#53423C'
      strokeWidth='1.5'
      d='M47.78 45.124a27 27 0 112.706-32.714l-.383.246a26.545 26.545 0 10-2.66 32.162l.337.306z'
      mask='url(#a)'
    ></path>
  </svg>
);

const Arrow = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='23' height='10' fill='none' className={styles.arrow}>
    <path
      stroke='#53423C'
      strokeWidth='0.75'
      d='M.534 5h21.812m0 0l-3.75-3.75M22.346 5l-3.75 3.75'
    ></path>
  </svg>
);

export default Button;