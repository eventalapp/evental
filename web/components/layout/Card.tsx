import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';

import { Heading } from '../primitives/Heading';
import { Paragraph } from '../primitives/Paragraph';

type CardProps = {
	header: string;
	icon?: IconDefinition;
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
				'z-10 flex h-full flex-col rounded-md border border-gray-300 bg-white p-6 shadow-sm',
				className
			)}
		>
			{icon && (
				<div
					className={classNames(
						'mb-4 flex h-14 w-14 items-center justify-center rounded-md',
						iconWrapperClassName
					)}
				>
					<FontAwesomeIcon
						fill="currentColor"
						className={classNames('block h-8 w-8', iconClassName)}
						size="1x"
						icon={icon}
					/>
				</div>
			)}

			<Heading level={3} variant="xl" className="mb-3">
				{header}
			</Heading>
			<Paragraph variant="default" className="max-w-3xl text-sm  text-gray-600">
				{body}
			</Paragraph>
		</div>
	);
};
