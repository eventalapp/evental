import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Editor } from '@tiptap/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useImageUpload } from '../../hooks/mutations/useImageUpload';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../primitives/Button';
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
	const { imageUploadResponse, imageUploadMutation } = useImageUpload();

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
					Upload Image
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					Once you have selected your image, select the "Upload" button.
				</DialogPrimitive.Description>
				<div className="mt-2 space-y-3">
					<div className="mt-5 flex min-h-[250px] w-full flex-col items-center justify-center">
						<Label htmlFor="image" className="hidden">
							Image
						</Label>

						<ImageUpload files={files} setFiles={setFiles} />
					</div>

					<div className="mt-4 flex justify-end space-x-2">
						<Button
							variant="no-bg"
							onClick={() => {
								setIsOpen(false);
							}}
						>
							Cancel
						</Button>
						<Button
							variant="primary"
							onClick={() => {
								if (files.length >= 1) {
									imageUploadMutation.mutate({ image: files[0] });
									setIsOpen(false);
								} else {
									toast.error('Please upload an image');
								}
							}}
							disabled={imageUploadMutation.isLoading}
						>
							{imageUploadMutation.isLoading ? <LoadingInner /> : 'Upload'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};
