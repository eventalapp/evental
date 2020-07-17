import classNames from 'classnames';
import React from 'react';

type Props = React.FC<
	{ className?: string } & React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	>
>;

export const GuideCategoryCardWrapper: Props = (props) => {
	const { children, className, ...rest } = props;

	return (
		<div className={classNames('grid grid-cols-1 gap-12 md:grid-cols-2', className)} {...rest}>
			{children}
		</div>
	);
};
