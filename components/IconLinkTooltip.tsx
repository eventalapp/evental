import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

import Tooltip from './radix/components/Tooltip';

type Props = React.FC<
	{
		href: string;
		icon: IconDefinition;
		message: string;
		side?: 'bottom' | 'top' | 'right' | 'left' | undefined;
	} & React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
>;

export const IconLinkTooltip: Props = (props) => {
	const { children, href, icon, message, side, ...rest } = props;

	return (
		<Tooltip message={message} side={side}>
			<div className="-mr-1 inline-block">
				<Link href={href} passHref>
					<a {...rest}>
						<FontAwesomeIcon fill="currentColor" className="h-5 w-5 p-1" size="1x" icon={icon} />
					</a>
				</Link>
			</div>
		</Tooltip>
	);
};
