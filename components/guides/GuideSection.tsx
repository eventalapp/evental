import React from 'react';

type Props = React.FC<
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>;

export const GuideSection: Props = (props) => {
	const { children, ...rest } = props;

	return (
		<div className="my-7" {...rest}>
			{children}
		</div>
	);
};
