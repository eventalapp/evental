import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

type Props = {
	src: string;
	fallbackSrc: string;
	alt: string;
} & ImageProps;

export const ImageWithFallback: React.FC<Props> = (props) => {
	const { src, fallbackSrc, alt, ...rest } = props;
	const [imgSrc, setImgSrc] = useState(src);

	return (
		<Image
			alt={alt}
			src={imgSrc}
			onError={() => {
				setImgSrc(fallbackSrc);
			}}
			{...rest}
		/>
	);
};

export default ImageWithFallback;
