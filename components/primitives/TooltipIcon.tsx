import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import Tooltip from './Tooltip';

export const TooltipIconSkeleton: React.FC = () => {
	return (
		<>
			<Skeleton className="mr-1.5 h-4 w-4" />
			<Skeleton className="mr-1.5 h-4 w-28" />
		</>
	);
};

export const TooltipIcon: React.FC<{
	icon?: IconDefinition;
	tooltipMessage: string;
	label?: string;
	iconClassName?: string;
	wrapperClassName?: string;
	externalLink?: string;
	link?: string;
	customIcon?: React.ReactNode;
	labelComponent?: React.ReactNode;
}> = (props) => {
	const {
		icon = faQuestion,
		tooltipMessage,
		label,
		iconClassName,
		wrapperClassName,
		externalLink,
		customIcon,
		link,
		labelComponent
	} = props;

	const finalLabel = label || labelComponent;

	const finalIcon = customIcon ? (
		customIcon
	) : (
		<FontAwesomeIcon
			fill="currentColor"
			className={classNames('mr-1.5 h-4 w-4 text-gray-500', iconClassName)}
			size="1x"
			icon={icon}
		/>
	);

	if (link) {
		return (
			<Link href={link} passHref>
				<a>
					<Tooltip message={tooltipMessage}>
						<div
							className={classNames(
								'mr-3 mb-1 flex cursor-pointer flex-row items-center text-sm md:text-base',
								wrapperClassName
							)}
						>
							{finalIcon}

							<p>{finalLabel}</p>
						</div>
					</Tooltip>
				</a>
			</Link>
		);
	}

	if (externalLink) {
		return (
			<Tooltip message={tooltipMessage}>
				<a href={externalLink} target="_blank" rel="noopener noreferrer">
					<div
						className={classNames(
							'mr-3 mb-1 flex cursor-pointer flex-row items-center text-sm md:text-base',
							wrapperClassName
						)}
					>
						{finalIcon}

						<p>{finalLabel}</p>
					</div>
				</a>
			</Tooltip>
		);
	}

	return (
		<Tooltip message={tooltipMessage}>
			<div
				className={classNames(
					'mr-3 mb-1 flex cursor-help flex-row items-center text-sm md:text-base',
					wrapperClassName
				)}
			>
				{finalIcon}

				<p>{finalLabel}</p>
			</div>
		</Tooltip>
	);
};
