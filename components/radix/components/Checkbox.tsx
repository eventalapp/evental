import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import * as LabelPrimitive from '@radix-ui/react-label';
import cx from 'classnames';
import React from 'react';

interface Props {}

const Checkbox = (props: Props) => {
	return (
		<form className="flex items-center">
			<CheckboxPrimitive.Root
				id="c1"
				defaultChecked
				className={cx(
					'flex h-5 w-5 items-center justify-center rounded',
					'radix-state-checked:bg-primary-600 radix-state-unchecked:bg-gray-75 dark:radix-state-unchecked:bg-gray-900',
					'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
				)}
			>
				<CheckboxPrimitive.Indicator>
					<CheckIcon className="self-center w-4 h-4 text-white" />
				</CheckboxPrimitive.Indicator>
			</CheckboxPrimitive.Root>

			<LabelPrimitive.Label
				htmlFor="c1"
				className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100 select-none"
			>
				Accept terms and conditions
			</LabelPrimitive.Label>
		</form>
	);
};

export default Checkbox;
