import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

import Tooltip from './radix/components/Tooltip';

type Props = React.FC<
	{
		href?: string;
		icon: IconDefinition;
		message: string;
		side?: 'bottom' | 'top' | 'right' | 'left' | undefined;
		className?: string;
	} & React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
>;

export const IconLinkTooltip: Props = (props) => {
	const { children, href, icon, message, className, side, ...rest } = props;

	if (href) {
		return (
			<Tooltip message={message} side={side}>
				<div className="-mr-1">
					<Link href={href} passHref>
						<a className={classNames('flex items-center justify-center', className)} {...rest}>
							<FontAwesomeIcon fill="currentColor" className="h-5 w-5 p-1" size="1x" icon={icon} />
						</a>
					</Link>
				</div>
			</Tooltip>
		);
	}

	return (
		<Tooltip message={message} side={side}>
			<div className="-mr-1">
				<Link href={href} passHref>
					<a className={classNames('flex items-center justify-center', className)} {...rest}>
						<FontAwesomeIcon fill="currentColor" className="h-5 w-5 p-1" size="1x" icon={icon} />
					</a>
				</Link>
			</div>
		</Tooltip>
	);
};
