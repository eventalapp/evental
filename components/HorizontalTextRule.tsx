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
		<div className={classNames('relative flex items-center py-1.5', className)} {...rest}>
			<div className="grow border-t border-gray-300" />
			<span className="mx-4 shrink text-gray-400">{text}</span>
			<div className="grow border-t border-gray-300" />
		</div>
	);
};
