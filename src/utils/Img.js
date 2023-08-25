import React from "react"
import NextImage from "next/image"

const Img = ({
  data,
  loading='lazy',
  quality=80,
  ...props
}) => (
  <NextImage
    src={data.asset.url}
    alt={data.asset.altText || ''}
    width={data.asset.metadata.dimensions.width}
    height={data.asset.metadata.dimensions.height}
    loading={loading}
    quality={quality}
    {...props}
  />
)

export default Img;