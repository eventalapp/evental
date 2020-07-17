import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';

type Props = React.FC<
	{ className?: string; imageUrl: string; alt: string; ratio: number } & React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	>
>;

export const AspectImage: Props = (props) => {
	const { className, children, imageUrl, alt, ratio, ...rest } = props;

	return (
		<div className={classNames('relative w-full rounded-md', className)} {...rest}>
			<AspectRatio.Root ratio={ratio}>
				<Image alt={alt} src={imageUrl} className="rounded-md" layout="fill" />
			</AspectRatio.Root>
		</div>
	);
};
