import * as SwitchPrimitive from '@radix-ui/react-switch';
import { SwitchProps } from '@radix-ui/react-switch';
import classNames from 'classnames';
import React from 'react';

type Props = SwitchProps & React.RefAttributes<HTMLButtonElement>;

const Switch = (props: Props) => {
	return (
		<SwitchPrimitive.Root
			{...props}
			className={classNames(
				'group relative inline-flex h-[24px] w-[44px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-gray-900 focus-visible:ring-opacity-75 radix-state-checked:bg-primary radix-state-unchecked:bg-gray-200 dark:radix-state-unchecked:bg-gray-800'
			)}
		>
			<SwitchPrimitive.Thumb
				className={classNames(
					'pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-radix-state-checked:translate-x-5 group-radix-state-unchecked:translate-x-0'
				)}
			/>
		</SwitchPrimitive.Root>
	);
};

export default Switch;
