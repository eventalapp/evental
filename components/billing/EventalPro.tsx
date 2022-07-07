import React from 'react';

type EventalProProps = {
	className?: string;
	isEducation?: boolean;
};

export const EventalPro: React.FC<EventalProProps> = (props) => {
	const { isEducation = false } = props;

	return (
		<div className="flex flex-row items-center">
			<strong className="mr-2 font-display text-2xl font-bold tracking-tight">Evental</strong>
			<span className="rounded bg-primary py-1 px-2 text-xs font-medium text-white">
				{isEducation ? 'EDU' : 'PRO'}
			</span>
		</div>
	);
};
