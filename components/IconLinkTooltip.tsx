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
			<div className="inline-block -mr-1">
				<Link href={href} passHref>
					<a {...rest}>
						<FontAwesomeIcon fill="currentColor" className="p-1 w-6 h-6" size="1x" icon={icon} />
					</a>
				</Link>
			</div>
		</Tooltip>
	);
};
