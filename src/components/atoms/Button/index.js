import Link from 'next/link';
import './styles.scss'

const Button = ({ data, theme = 'primary', children, to, className, ...props }) => {
  if(data){
    theme = data.theme;
    to = data.href;
    children = data.text;
  }
  const isExternal = to?.startsWith('https://');

  const commonProps = {
    className: `cta ${className}`,
    "data-theme": theme,
    ...props,
  };

  return (
    to ? (
      isExternal
      ? (
        <a href={to} target="_blank" rel="noreferrer" {...commonProps}>
          {children}
        </a>
      ) : (
        <Link as={Link} href={to} {...commonProps}>
          {children}
        </Link>
      )
    ) : (
      <button {...commonProps}>
        {children}
      </button>
    )
  )
};
 
export default Button;