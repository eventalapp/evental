import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';

import Tooltip from './Tooltip';

type Props = React.FC<
	{ className?: string; message: string } & React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	>
>;

export const HelpTooltip: Props = (props) => {
	const { children, className, message, ...rest } = props;

	return (
		<Tooltip message={message} side={'top'}>
			<div className={classNames('ml-1.5 inline cursor-help text-gray-400', className)} {...rest}>
				<FontAwesomeIcon fill="currentColor" className="h-3.5 w-3.5" icon={faCircleQuestion} />
			</div>
		</Tooltip>
	);
};
