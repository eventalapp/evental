import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import { SelectProps } from '@radix-ui/react-select';
import cx from 'classnames';
import React from 'react';
import Button from './shared/Button';

type Option = {
	label: string;
	value: string;
};

type Props = {
	options: Option[];
} & SelectProps;

const Select = (props: Props) => {
	const { options, ...rest } = props;

	return (
		<SelectPrimitive.Root {...rest}>
			<SelectPrimitive.Trigger asChild aria-label="Food">
				<Button className="w-full">
					<SelectPrimitive.Value />
					<SelectPrimitive.Icon className="ml-2">
						<ChevronDownIcon />
					</SelectPrimitive.Icon>
				</Button>
			</SelectPrimitive.Trigger>
			<SelectPrimitive.Content>
				<SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
					<ChevronUpIcon />
				</SelectPrimitive.ScrollUpButton>
				<SelectPrimitive.Viewport className="border border-gray-300 bg-white dark:bg-gray-800 p-2 rounded-lg">
					<SelectPrimitive.Group>
						{options.map((f, i) => (
							<SelectPrimitive.Item
								key={`${f}-${i}`}
								value={f.value}
								className={cx(
									'relative flex items-center px-8 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 font-medium focus:bg-gray-100 dark:focus:bg-gray-900',
									'radix-disabled:opacity-50',
									'focus:outline-none select-none'
								)}
							>
								<SelectPrimitive.ItemText>{f.label}</SelectPrimitive.ItemText>
								<SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
									<CheckIcon />
								</SelectPrimitive.ItemIndicator>
							</SelectPrimitive.Item>
						))}
					</SelectPrimitive.Group>
				</SelectPrimitive.Viewport>
				<SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
					<ChevronDownIcon />
				</SelectPrimitive.ScrollDownButton>
			</SelectPrimitive.Content>
		</SelectPrimitive.Root>
	);
};

export default Select;
