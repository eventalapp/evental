import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import { SelectProps } from '@radix-ui/react-select';
import cx from 'classnames';

import { Button } from './Button';

export type Option = {
	label: string;
	value: string;
};

type Props = { color?: string; options: Option[] } & SelectProps;

const Select = (props: Props) => {
	const { options, color, ...rest } = props;

	return (
		<SelectPrimitive.Root {...rest}>
			<SelectPrimitive.Trigger className="w-full" asChild>
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
				<SelectPrimitive.Viewport className="rounded-lg border border-gray-300 bg-white p-2 dark:bg-gray-800">
					<SelectPrimitive.Group>
						{options.map((f, i) => (
							<SelectPrimitive.Item
								key={`${f}-${i}`}
								value={f.value}
								className={cx(
									'relative flex items-center rounded-md px-8 py-2 text-sm font-medium text-gray-700 focus:bg-gray-75 dark:text-gray-300 dark:focus:bg-gray-900',
									'radix-disabled:opacity-50',
									'select-none focus:outline-none'
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
