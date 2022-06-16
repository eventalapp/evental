import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import cx from 'classnames';
import React, { Fragment } from 'react';

interface Props {}

const AspectRatio = (props: Props) => {
	return (
		<Fragment>
			<AspectRatioPrimitive.Root
				ratio={16 / 9}
				className="group overflow-hidden relative w-full h-full rounded-lg shadow-md"
			>
				<div className="flex absolute inset-0 z-10 justify-center items-center">
					<h3 className="text-2xl font-black text-transparent uppercase bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 group-hover:opacity-0 duration-300 ease-in-out select-none sm:text-4xl md:text-3xl">
						Vancouver
					</h3>
				</div>
				<div
					className={cx(
						'absolute inset-0 bg-gray-600 object-cover group-hover:bg-gray-500',
						'transition-colors duration-300 ease-in-out'
					)}
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="https://images.unsplash.com/photo-1609825488888-3a766db05542?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
						alt="Vancouver by Matt Wang"
						className="w-full h-full mix-blend-overlay"
					/>
				</div>
			</AspectRatioPrimitive.Root>
		</Fragment>
	);
};

export default AspectRatio;
