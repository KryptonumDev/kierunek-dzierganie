import React from "react";
import rehypeRaw from "rehype-raw";
import Markdown from "./Markdown";

const Heading = ({ level = 'h2', children, image, ...props }) => {
  const HeadingComponent = level;
  return (
    <Markdown
      components={{
        'p': ({ children }) => <HeadingComponent {...props}>{image}{children}</HeadingComponent>
      }}
      rehypePlugins={[rehypeRaw]}
    > 
      {children}
    </Markdown>
  );
}

export default Heading;