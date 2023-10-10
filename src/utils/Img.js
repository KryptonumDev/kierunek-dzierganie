import React from "react"
import NextImage from "next/image"

const Img = ({
  data,
  ...props
}) => (
  data?.asset.url && (
    <NextImage
      src={data.asset.url}
      alt={data.asset.altText || ''}
      width={data.asset.metadata.dimensions.width}
      height={data.asset.metadata.dimensions.height}
      {...(data?.asset.metadata.lqip && {
        blurDataURL: data.asset.metadata.lqip,
        placeholder: "blur",
      })}
      {...props}
    />
  )
)

export default Img;