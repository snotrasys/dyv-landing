import Image from 'next/image';
import React from 'react';

export default function ImgS3({ src, alt, className = "", ...props }) {
  return (
    <>
      <img
        loading='lazy'
        src={` https://s3.magic-api.xyz/celestia${src}`}
        alt={alt || ""}
        className={className}
        {...props}
      />
    </>
  );
}
