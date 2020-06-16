import Link from 'next/link';
import React from 'react';

import { CopyToClipboard } from './CopyToClipboard';

type Props = React.FC<
	{ url: string; text: string } & React.DetailedHTMLProps<
		React.AnchorHTMLAttributes<HTMLAnchorElement>,
		HTMLAnchorElement
	>
>;

export const GuideSectionHeader: Props = (props) => {
	const { children, text, url, ...rest } = props;

	return (
		<Link href={url}>
			<a className="block text-xl font-bold leading-none" {...rest}>
				{text} <CopyToClipboard link={url} />
			</a>
		</Link>
	);
};
