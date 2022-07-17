import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import classNames from 'classnames';
import React from 'react';

type DialogContentProps = {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	showCloseDialog?: boolean;
	children?: React.ReactNode;
	size?: keyof typeof sizes;
};

const sizes = {
	'sm': 'max-w-md',
	'md': 'max-w-lg',
	'lg': 'max-w-xl',
	'xl': 'max-w-2xl',
	'2xl': 'max-w-3xl'
};

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
	(props, forwardedRef) => {
		const { children, isOpen, setIsOpen, showCloseDialog = true, size = 'sm', ...rest } = props;

		return (
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay
					className="fixed inset-0 z-20 bg-black/50"
					onClick={() => {
						setIsOpen(false);
					}}
				/>

				<DialogPrimitive.Content
					ref={forwardedRef}
					className={classNames(
						'fixed top-[50%] left-[50%] z-50 max-h-[90vh] w-[95vw] -translate-x-[50%] -translate-y-[50%] overflow-y-scroll rounded-lg bg-white p-4 focus:outline-none focus-visible:ring focus-visible:ring-gray-900 focus-visible:ring-opacity-75 dark:bg-gray-800 md:w-full',
						sizes[size]
					)}
					{...rest}
				>
					<div className="relative">
						{children}

						{showCloseDialog && (
							<DialogPrimitive.Close
								className={classNames(
									'absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full p-1 focus:outline-none focus-visible:ring focus-visible:ring-gray-900 focus-visible:ring-opacity-75'
								)}
							>
								<FontAwesomeIcon
									fill="currentColor"
									className="h-5 w-5 text-gray-500 hover:text-gray-700"
									icon={faXmark}
								/>
							</DialogPrimitive.Close>
						)}
					</div>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		);
	}
);
