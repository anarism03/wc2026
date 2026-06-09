import type { ImgHTMLAttributes } from 'react'

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt: string
  width?: number
  height?: number
  unoptimized?: boolean
  priority?: boolean
}

export default function Image({ unoptimized: _unoptimized, priority: _priority, ...props }: ImageProps) {
  return <img loading={_priority ? 'eager' : props.loading} {...props} />
}
