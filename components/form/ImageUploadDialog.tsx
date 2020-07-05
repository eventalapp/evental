import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Editor } from '@tiptap/react';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useImageUploadMutation } from '../../hooks/mutations/useImageUploadMutation';
import { LoadingInner } from '../error/LoadingInner';
import { DialogContent } from '../primitives/DialogContent';
import { Label } from '../primitives/Label';
import { FileWithPreview } from './AvatarUpload';
import ImageUpload from './ImageUpload';

interface Props {
	onSubmit: (link?: string) => void;
	editor: Editor | null;
}

export const ImageUploadDialog: React.FC<Props> = (props) => {
	const { children, onSubmit } = props;

	const [isOpen, setIsOpen] = useState(false);
	const { imageUploadResponse, imageUploadMutation } = useImageUploadMutation();

	const [files, setFiles] = React.useState<FileWithPreview[]>([]);

	useEffect(() => {
		if (imageUploadResponse) {
			onSubmit(`https://cdn.evental.app${imageUploadResponse.pathName}`);
			setIsOpen(false);
		}
	}, [imageUploadResponse]);

	useEffect(() => {
		setFiles([]);
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
				<div className="mt-2 space-y-3">
					<div className="mt-5 flex min-h-[250px] w-full flex-col items-center justify-center">
						<Label htmlFor="image" className="hidden">
							Image
						</Label>

						<ImageUpload files={files} setFiles={setFiles} />
					</div>

					<div className="mt-4 flex justify-end">
						<button
							disabled={imageUploadMutation.isLoading}
							onClick={() => {
								if (files.length >= 1) {
									imageUploadMutation.mutate({ image: files[0] });
									setIsOpen(false);
								} else {
									toast.error('Please upload an image');
								}
							}}
							className={cx(
								'inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium',
								'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:text-gray-100 dark:hover:bg-primary-600',
								'border border-transparent',
								'focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75'
							)}
						>
							{imageUploadMutation.isLoading ? <LoadingInner /> : 'Add Image'}
						</button>
					</div>
				</div>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};
