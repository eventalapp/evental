import React from 'react';

type Props = React.FC<
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>;

export const GuideCategoryCard: Props = (props) => {
	const { children, ...rest } = props;

	return (
		<div className="border border-gray-200 p-5 rounded-md shadow-sm" {...rest}>
			{children}
		</div>
	);
};
