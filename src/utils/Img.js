import React from "react"
import NextImage from "next/image"

const Img = ({
  data,
  loading='lazy',
  quality=80,
  className,
}) => (
  <NextImage
    loading={loading}
    quality={quality}
    src={data.asset.url}
    alt={data.asset.altText || ''}
    width={data.asset.metadata.dimensions.width}
    height={data.asset.metadata.dimensions.height}
    className={className || ''}
  />
)

export default Img;