import * as SliderPrimitive from '@radix-ui/react-slider';
import cx from 'classnames';
import React from 'react';

interface Props {
	defaultValue?: number;
	max?: number;
	min?: number;
	step?: number;
	onChange?: (value: number) => void;
	value?: number;
}

const Slider = (props: Props) => {
	const { defaultValue = 50, max = 100, min = 0, step = 1, value, onChange } = props;

	return (
		<SliderPrimitive.Root
			defaultValue={[defaultValue]}
			max={max}
			step={step}
			min={min}
			value={[value] as number[]}
			onValueChange={(value) => {
				onChange?.(value[0]);
			}}
			aria-label="value"
			className="relative flex h-5 w-80 touch-none items-center"
		>
			<SliderPrimitive.Track className="relative h-1 w-full grow rounded-full bg-gray-200 dark:bg-gray-800">
				<SliderPrimitive.Range className="absolute h-full rounded-full bg-primary-500 dark:bg-white" />
			</SliderPrimitive.Track>
			<SliderPrimitive.Thumb
				className={cx(
					'block h-5 w-5 rounded-full bg-primary-400 dark:bg-white',
					'focus:outline-none focus-visible:ring focus-visible:ring-gray-900 focus-visible:ring-opacity-75',
					'cursor-grab'
				)}
			/>
		</SliderPrimitive.Root>
	);
};

export default Slider;
