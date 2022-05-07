import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import cx from 'classnames';
import React from 'react';

interface Props {
	message: string;
	side?: 'bottom' | 'top' | 'right' | 'left' | undefined;
}

const Tooltip: React.FC<Props> = (props) => {
	const { children, message, side } = props;

	return (
		<TooltipPrimitive.Provider delayDuration={100}>
			<TooltipPrimitive.Root>
				<TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
				<TooltipPrimitive.Content
					sideOffset={4}
					side={side}
					className={cx(
						'radix-side-top:animate-slide-down-fade',
						'radix-side-right:animate-slide-left-fade',
						'radix-side-bottom:animate-slide-up-fade',
						'radix-side-left:animate-slide-right-fade',
						'inline-flex items-center rounded-md px-4 py-2.5 duration-75',
						'bg-gray-800 dark:bg-gray-800'
					)}
				>
					<TooltipPrimitive.Arrow className="fill-current text-gray-800 dark:text-gray-800" />
					<span className="block text-sm leading-none text-white dark:text-gray-100">
						{message}
					</span>
				</TooltipPrimitive.Content>
			</TooltipPrimitive.Root>
		</TooltipPrimitive.Provider>
	);
};

export default Tooltip;
