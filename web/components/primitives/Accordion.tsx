import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import cx from 'classnames';
import React, { ReactElement } from 'react';

interface AccordionItem {
	header: string;
	content: ReactElement;
}

interface Props {
	items: AccordionItem[];
	className?: string;
}

export const Accordion: React.FC<Props> = (props) => {
	return (
		<AccordionPrimitive.Root type="multiple" className={cx('space-y-4', props.className)}>
			{props.items.map(({ header, content }, i) => (
				<AccordionPrimitive.Item
					key={`header-${i}`}
					value={`item-${i + 1}`}
					className="rounded-lg focus-visible:ring focus-visible:ring-gray-900 focus-visible:ring-opacity-75 focus:outline-none"
				>
					<AccordionPrimitive.Header className="w-full">
						<AccordionPrimitive.Trigger
							className={cx(
								'group',
								'radix-state-open:rounded-t-lg radix-state-closed:rounded-lg',
								'focus:outline-none',
								'inline-flex w-full items-center justify-between bg-gray-100 px-4 py-2 text-left dark:bg-gray-800'
							)}
						>
							<span className="text-sm font-medium text-gray-900 dark:text-gray-100">{header}</span>
							<ChevronDownIcon
								className={cx(
									'ml-2 h-5 w-5 shrink-0 text-gray-700 ease-in-out dark:text-gray-400',
									'group-radix-state-open:rotate-180 group-radix-state-open:duration-300'
								)}
							/>
						</AccordionPrimitive.Trigger>
					</AccordionPrimitive.Header>
					<AccordionPrimitive.Content className="w-full rounded-b-lg bg-gray-100 px-4 pb-3 pt-1 dark:bg-gray-800">
						<div className="text-sm text-gray-700 dark:text-gray-400">{content}</div>
					</AccordionPrimitive.Content>
				</AccordionPrimitive.Item>
			))}
		</AccordionPrimitive.Root>
	);
};
