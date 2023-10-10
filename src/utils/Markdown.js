import NextImage from "next/image"
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const ListRenderer = ({ children }) => (
  <li>
    <span>{children}</span>
  </li>
)

const Markdown = ({ level, children, components, ...props }) => {
  const HeadingComponent = level;
  const updatedComponents =
    level
      ? {
        ...components,
        p: ({ children }) => <HeadingComponent {...props}>{children}</HeadingComponent>
      }
      : components;

  return (
    <ReactMarkdown
      components={{
        li: ListRenderer,
        ol: ({ children }) => <ol className="orderedList">{children}</ol>,
        ul: ({ children }) => <ul className="unorderedList">{children}</ul>,
        img: ({ src, alt }) => {
          const { w, h } = Object.fromEntries(new URL(src).searchParams.entries());
          return <NextImage src={src} alt={alt} width={w} height={h} />
        },
        ...updatedComponents,
      }}
      rehypePlugins={[rehypeRaw]}
      {...props}
    >
      {children}
    </ReactMarkdown>
  );
}

Markdown.h1 = (props) => <Markdown level="h1" {...props} />;
Markdown.h2 = (props) => <Markdown level="h2" {...props} />;
Markdown.h3 = (props) => <Markdown level="h3" {...props} />;
Markdown.h4 = (props) => <Markdown level="h4" {...props} />;
Markdown.h5 = (props) => <Markdown level="h5" {...props} />;
Markdown.h6 = (props) => <Markdown level="h6" {...props} />;

export default Markdown;