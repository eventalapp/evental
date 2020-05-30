import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import Image from 'next/image';
import React from 'react';

type Props = React.FC<
	{ imageUrl: string; alt: string; ratio: number } & React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	>
>;

export const AspectImage: Props = (props) => {
	const { children, imageUrl, alt, ratio, ...rest } = props;

	return (
		<div className="w-full relative border border-gray-200 shadow-sm rounded-md" {...rest}>
			<AspectRatio.Root ratio={ratio}>
				<Image alt={alt} src={imageUrl} className="rounded-md" layout="fill" />
			</AspectRatio.Root>
		</div>
	);
};
