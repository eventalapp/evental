import classNames from 'classnames';
import React from 'react';

type Props = React.FC<
	{ className?: string; text: string } & React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	>
>;

export const HorizontalTextRule: Props = (props) => {
	const { className, text, ...rest } = props;

	return (
		<div className={classNames('relative flex py-1.5 items-center', className)} {...rest}>
			<div className="flex-grow border-t border-gray-300" />
			<span className="flex-shrink mx-4 text-gray-400">{text}</span>
			<div className="flex-grow border-t border-gray-300" />
		</div>
	);
};
