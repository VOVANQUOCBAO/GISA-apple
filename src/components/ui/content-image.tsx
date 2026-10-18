import NextImage, { type ImageProps } from 'next/image';

/** Retain detail in supplied photographs while Next serves responsive sizes. */
export default function ContentImage({ quality = 95, ...props }: ImageProps) {
  return <NextImage quality={quality} {...props} />;
}
