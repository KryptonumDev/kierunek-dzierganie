import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";

const LinkRenderer = ({ href, children }) => {
  const isExternal = href && (href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:'));
  return (
    isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="link">
        {children}
      </a>
    ) : (
      <Link href={href} className="link">{children}</Link>
    )
  );
};

const ListRenderer = ({ children, ordered }) => (
  <li>
    {!ordered && <ListBullet />}
    <span>{children}</span>
  </li>
)

const Markdown = ({ children, components, ...props }) => {
  return (
    <ReactMarkdown
      components={{
        a: LinkRenderer,
        li: ListRenderer,
        ol: ({ children }) => <ol className="orderedList">{children}</ol>,
        ul: ({ children }) => <ul className="unorderedList">{children}</ul>,
        ...components
      }}
      {...props}
    >
      {children}
    </ReactMarkdown>
  );
}

const ListBullet = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'>
    <path
      fill='#2E445A'
      d='M4 11.25a.75.75 0 000 1.5v-1.5zm0 1.5h16v-1.5H4v1.5z'
      opacity='0.5'
    ></path>
    <path
      stroke='#2E445A'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      d='M14 6l6 6-6 6'
    ></path>
  </svg>
)
 
export default Markdown;