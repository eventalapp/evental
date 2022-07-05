import { Transition } from '@headlessui/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';
import { Editor } from '@tiptap/react';
import cx from 'classnames';
import React, { Fragment, useEffect, useState } from 'react';

interface Props {
	onSubmit: (link: string) => void;
	editor: Editor | null;
}

export const LinkDialog: React.FC<Props> = (props) => {
	const { children, onSubmit, editor } = props;

	const [isOpen, setIsOpen] = useState(false);
	const [link, setLink] = useState(editor?.getAttributes('link').href || '');

	useEffect(() => {
		setLink(editor?.getAttributes('link').href || '');
	}, [isOpen]);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>
			<Transition.Root show={isOpen}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<DialogPrimitive.Overlay forceMount className="fixed inset-0 z-20 bg-black/50" />
				</Transition.Child>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<DialogPrimitive.Content
						forceMount
						className={cx(
							'fixed z-50',
							'w-[95vw] max-w-md rounded-lg p-4 md:w-full',
							'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
							'bg-white dark:bg-gray-800',
							'focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75'
						)}
					>
						<DialogPrimitive.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
							Edit link
						</DialogPrimitive.Title>
						<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
							Make changes to your link here. Click save when you&apos;re done.
						</DialogPrimitive.Description>
						<div className="mt-2 space-y-2">
							<fieldset>
								<label
									htmlFor="link"
									className="text-xs font-medium text-gray-700 dark:text-gray-400"
								>
									Link URL
								</label>
								<input
									id="link"
									type="text"
									value={link}
									onChange={(e) => {
										setLink(e.target.value);
									}}
									placeholder="https://example.com"
									className={cx(
										'mt-1 block w-full rounded-md',
										'text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600',
										'border border-gray-400 focus:border-transparent dark:border-gray-700 dark:bg-gray-800',
										'focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75'
									)}
								/>
							</fieldset>
						</div>

						<div className="mt-4 flex justify-end">
							<DialogPrimitive.Close
								onClick={() => {
									onSubmit(link);
								}}
								className={cx(
									'inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium',
									'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:text-gray-100 dark:hover:bg-primary-600',
									'border border-transparent',
									'focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75'
								)}
							>
								Save
							</DialogPrimitive.Close>
						</div>

						<DialogPrimitive.Close
							className={cx(
								'absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1',
								'focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75'
							)}
						>
							<Cross1Icon className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400" />
						</DialogPrimitive.Close>
					</DialogPrimitive.Content>
				</Transition.Child>
			</Transition.Root>
		</DialogPrimitive.Root>
	);
};
