import React from 'react';

type Props = React.FC<
	{ href: string } & React.DetailedHTMLProps<
		React.AnchorHTMLAttributes<HTMLAnchorElement>,
		HTMLAnchorElement
	>
>;

export const BlankLink: Props = (props) => {
	const { children, href, ...rest } = props;

	return (
		<a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
			{children}
		</a>
	);
};
