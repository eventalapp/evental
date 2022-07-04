import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as DialogPrimitive from '@radix-ui/react-alert-dialog';
import cx from 'classnames';
import React from 'react';

import Tooltip from './Tooltip';

type DialogContentProps = {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	showCloseDialog?: boolean;
	children?: React.ReactNode;
};

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
	(props, forwardedRef) => {
		const { children, isOpen, setIsOpen, showCloseDialog = true, ...rest } = props;

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
					className={cx(
						'fixed z-50',
						'w-[95vw] max-w-md rounded-lg p-4 md:w-full',
						'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
						'bg-white dark:bg-gray-800',
						'focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75'
					)}
					{...rest}
				>
					<div className="relative">
						{children}

						{showCloseDialog && (
							<div className="absolute top-0 right-0">
								<Tooltip message="Close this dialog">
									<DialogPrimitive.Cancel aria-label="Close">
										<FontAwesomeIcon
											fill="currentColor"
											className="h-5 w-5 text-gray-500"
											icon={faXmark}
										/>
									</DialogPrimitive.Cancel>
								</Tooltip>
							</div>
						)}
					</div>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		);
	}
);
