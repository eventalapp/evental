import * as ProgressPrimitive from '@radix-ui/react-progress';
import React, { useEffect } from 'react';

interface Props {}

const Progress = (props: Props) => {
	const [progress, setProgress] = React.useState(60);

	useEffect(() => {
		let timerId: null | NodeJS.Timer = null;

		timerId = setInterval(() => {
			const p = Math.ceil(100 / 10) * 10;
			setProgress(p);
		}, 5000);

		return () => {
			if (timerId) {
				clearInterval(timerId);
			}
		};
	}, []);

	return (
		<ProgressPrimitive.Root
			value={progress}
			className="overflow-hidden w-full h-3 bg-white dark:bg-gray-900 rounded-full"
		>
			<ProgressPrimitive.Indicator
				style={{ width: `${progress}%` }}
				className="h-full bg-primary-500 dark:bg-white duration-300 ease-in-out"
			/>
		</ProgressPrimitive.Root>
	);
};

export default Progress;
