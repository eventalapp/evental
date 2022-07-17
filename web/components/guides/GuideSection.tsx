import React from 'react';

type Props = React.FC<
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>;

export const GuideSection: Props = (props) => {
	const { children, ...rest } = props;

	return (
		<div className="mt-12 space-y-5" {...rest}>
			{children}
		</div>
	);
};
