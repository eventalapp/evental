import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';

import { Heading } from '../primitives/Heading';
import { Paragraph } from '../primitives/Paragraph';

type CardProps = {
	header: string;
	icon: IconDefinition;
	iconWrapperClassName?: string;
	iconClassName?: string;
	className?: string;
	body: React.ReactNode;
};

export const Card: React.FC<CardProps> = (props) => {
	const { body, header, icon, iconClassName, iconWrapperClassName, className } = props;

	return (
		<div
			className={classNames(
				'bg-white p-5 border border-gray-300 shadow-sm rounded-md flex flex-col justify-center items-center h-full z-10',
				className
			)}
		>
			<div
				className={classNames(
					'flex items-center justify-center w-14 h-14 rounded-md mb-4',
					iconWrapperClassName
				)}
			>
				<FontAwesomeIcon
					fill="currentColor"
					className={classNames('h-8 w-8 block', iconClassName)}
					size="1x"
					icon={icon}
				/>
			</div>
			<Heading level={2} variant="xl" className="mb-3">
				{header}
			</Heading>
			<Paragraph variant="default" className="mb-3 max-w-3xl text-gray-600 text-center">
				{body}
			</Paragraph>
		</div>
	);
};
