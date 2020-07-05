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
	small: 'max-w-md',
	medium: 'max-w-lg',
	large: 'max-w-xl'
};

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
	(props, forwardedRef) => {
		const { children, isOpen, setIsOpen, showCloseDialog = true, size = 'small', ...rest } = props;

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
						'fixed z-50 w-[95vw] rounded-lg p-4 md:w-full top-[50%] -translate-x-[50%] -translate-y-[50%] bg-white dark:bg-gray-800 focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75 left-[50%]',
						sizes[size]
					)}
					{...rest}
				>
					<div className="relative">
						{children}

						{showCloseDialog && (
							<DialogPrimitive.Close
								className={classNames(
									'absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full p-1 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
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
