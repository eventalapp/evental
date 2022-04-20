import React from 'react';
import classNames from 'classnames';

interface Props {
	className?: string;
	[x: string]: unknown;
}

type LayoutProps = Props &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const Column: React.FC<LayoutProps> = (props) => {
	const { className, ...rest } = props;

	return (
		<div className={classNames('w-11/12 lg:max-w-6xl md:w-4/6 m-auto', className)} {...rest}>
			{props.children}
		</div>
	);
};

export default Column;
