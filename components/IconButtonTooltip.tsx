import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import { faSpinnerThird } from '../icons';
import Tooltip from './radix/components/Tooltip';

type Props = React.FC<
	{
		icon: IconDefinition;
		message: string;
		side?: 'bottom' | 'top' | 'right' | 'left' | undefined;
		LoadingComponent?: JSX.Element;
		isLoading?: boolean;
	} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>;

export const IconButtonTooltip: Props = (props) => {
	const { children, icon, message, className, side, isLoading, ...rest } = props;

	return (
		<Tooltip message={message} side={side}>
			<div
				className={classNames(
					'-mr-1 inline-block disabled:text-gray-300 disabled:cursor-not-allowed',
					className
				)}
			>
				<button {...rest}>
					{isLoading ? (
						<FontAwesomeIcon
							fill="currentColor"
							className="p-1 w-6 h-6 animate-spin"
							size="1x"
							icon={faSpinnerThird}
						/>
					) : (
						<FontAwesomeIcon fill="currentColor" className="p-1 w-6 h-6" size="1x" icon={icon} />
					)}
				</button>
			</div>
		</Tooltip>
	);
};
