import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import { SelectProps } from '@radix-ui/react-select';
import cx from 'classnames';
import Button from './shared/Button';

export type Option = {
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
			<SelectPrimitive.Trigger className="w-full" asChild>
				<Button className="w-full">
					<SelectPrimitive.Value />
					<SelectPrimitive.Icon className="ml-2">
						<ChevronDownIcon />
					</SelectPrimitive.Icon>
				</Button>
			</SelectPrimitive.Trigger>
			<SelectPrimitive.Content>
				<SelectPrimitive.ScrollUpButton className="flex justify-center items-center text-gray-700 dark:text-gray-300">
					<ChevronUpIcon />
				</SelectPrimitive.ScrollUpButton>
				<SelectPrimitive.Viewport className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300">
					<SelectPrimitive.Group>
						{options.map((f, i) => (
							<SelectPrimitive.Item
								key={`${f}-${i}`}
								value={f.value}
								className={cx(
									'relative flex items-center px-8 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 font-medium focus:bg-gray-75 dark:focus:bg-gray-900',
									'radix-disabled:opacity-50',
									'focus:outline-none select-none'
								)}
							>
								<SelectPrimitive.ItemText>{f.label}</SelectPrimitive.ItemText>
								<SelectPrimitive.ItemIndicator className="inline-flex absolute left-2 items-center">
									<CheckIcon />
								</SelectPrimitive.ItemIndicator>
							</SelectPrimitive.Item>
						))}
					</SelectPrimitive.Group>
				</SelectPrimitive.Viewport>
				<SelectPrimitive.ScrollDownButton className="flex justify-center items-center text-gray-700 dark:text-gray-300">
					<ChevronDownIcon />
				</SelectPrimitive.ScrollDownButton>
			</SelectPrimitive.Content>
		</SelectPrimitive.Root>
	);
};

export default Select;
