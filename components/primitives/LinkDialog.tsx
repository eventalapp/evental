import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Editor } from '@tiptap/react';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';

import { Button } from './Button';
import { DialogContent } from './DialogContent';

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
			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen}>
				<DialogPrimitive.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
					Edit link
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					Make changes to your link here. Click save when you&apos;re done.
				</DialogPrimitive.Description>
				<div className="mt-2 space-y-2">
					<fieldset>
						<label htmlFor="link" className="text-xs font-medium text-gray-700 dark:text-gray-400">
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
								'focus:outline-none focus:ring focus:ring-gray-900 focus:ring-opacity-75'
							)}
						/>
					</fieldset>
				</div>

				<div className="mt-4 flex justify-end">
					<Button
						variant="primary"
						onClick={() => {
							onSubmit(link);
							setIsOpen(false);
						}}
					>
						Save
					</Button>
				</div>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};
