import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import Tooltip from './Tooltip';

export const iconColors = {
	gray: 'text-gray-700 hover:text-gray-600',
	red: 'text-red-500 hover:text-red-400',
	none: ''
};

type Props = React.FC<
	{
		icon: IconDefinition;
		message: string;
		side?: 'bottom' | 'top' | 'right' | 'left' | undefined;
		LoadingComponent?: JSX.Element;
		isLoading?: boolean;
		color?: keyof typeof iconColors;
	} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>;

export const IconButtonTooltip: Props = (props) => {
	const {
		children,
		icon,
		message,
		className,
		side = 'top',
		isLoading,
		color = 'gray',
		...rest
	} = props;

	return (
		<Tooltip message={message} side={side}>
			<div>
				<button
					className={classNames(
						'flex items-center disabled:cursor-not-allowed disabled:opacity-50 justify-center',
						iconColors[color],
						className
					)}
					{...rest}
				>
					{isLoading ? (
						<Skeleton className="w-5 h-5 p-1" />
					) : (
						<FontAwesomeIcon
							fill="currentColor"
							className="h-5 w-5 p-1 transition-colors duration-100"
							size="1x"
							icon={icon}
						/>
					)}
				</button>
			</div>
		</Tooltip>
	);
};
