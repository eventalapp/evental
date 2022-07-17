import React from 'react';

type CardGridProps = {};

export const CardGrid: React.FC<CardGridProps> = (props) => {
	const { children } = props;

	return <div className="grid grid-cols-1 gap-8 md:grid-cols-2">{children}</div>;
};
