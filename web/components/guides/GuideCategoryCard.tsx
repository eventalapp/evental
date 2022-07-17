import React from 'react';

type Props = React.FC<
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>;

export const GuideCategoryCard: Props = (props) => {
	const { children, ...rest } = props;

	return (
		<div className="rounded-md border border-gray-200 p-5 shadow-sm" {...rest}>
			{children}
		</div>
	);
};
