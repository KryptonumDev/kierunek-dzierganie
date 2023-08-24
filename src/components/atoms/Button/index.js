import styles from './styles.module.scss';
import Link from 'next/link';

const Button = ({ data, theme = 'primary', children, to, className, ...props }) => {
  if(data){
    theme = data.theme;
    to = data.href;
    children = data.text;
  }
  const isExternal = to?.startsWith('https://');

  const commonProps = {
    className: `cta ${className} ${styles.wrapper}`,
    "data-theme": theme,
    ...props,
  };

  return (
    to ? (
      isExternal
      ? (
        <a href={to} target="_blank" rel="noreferrer" {...commonProps}>
          <Arrow />
          <Ellipse />
          <span>
            {children}
          </span>
          <Arrow />
        </a>
      ) : (
        <Link as={Link} href={to} {...commonProps}>
          <Arrow />
          <Ellipse />
          <span>
            {children}
          </span>
          <Arrow />
        </Link>
      )
    ) : (
      <button {...commonProps}>
        <Arrow />
        <Ellipse />
        <span>
          {children}
        </span>
        <Arrow />
      </button>
    )
  )
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
)

const Arrow = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='23' height='10' fill='none' className={styles.arrow}>
    <path
      stroke='#53423C'
      strokeWidth='0.75'
      d='M.534 5h21.812m0 0l-3.75-3.75M22.346 5l-3.75 3.75'
    ></path>
  </svg>
)
 
export default Button;