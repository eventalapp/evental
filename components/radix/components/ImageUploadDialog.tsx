import { Transition } from '@headlessui/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';
import cx from 'classnames';
import React, { Fragment, useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import { useImageUploadMutation } from '../../../hooks/mutations/useImageUploadMutation';
import * as Portal from '@radix-ui/react-portal';
import { Label } from '../../form/Label';
import { FileWithPreview } from '../../form/AvatarUpload';
import ImageUpload from '../../form/ImageUpload';

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
		<DialogPrimitive.Root open={isOpen}>
			<DialogPrimitive.Trigger
				asChild
				onClick={() => {
					setIsOpen(true);
				}}
			>
				{children}
			</DialogPrimitive.Trigger>
			<Portal.Root>
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
								'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
							)}
						>
							<DialogPrimitive.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
								Edit link
							</DialogPrimitive.Title>
							<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
								Make changes to your link here. Click save when you&apos;re done.
							</DialogPrimitive.Description>
							<div className="mt-2 space-y-3">
								<div className="flex flex-col w-full mt-5 items-center justify-center min-h-[250px]">
									<Label htmlFor="image" className="hidden">
										Image
									</Label>

									<ImageUpload files={files} setFiles={setFiles} />
								</div>

								<div className="mt-4 flex justify-end">
									<DialogPrimitive.Close
										disabled={imageUploadMutation.isLoading}
										onClick={() => {
											imageUploadMutation.mutate({ image: files[0] });
										}}
										className={cx(
											'inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium',
											'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:text-gray-100 dark:hover:bg-primary-600',
											'border border-transparent',
											'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
										)}
									>
										Add Image
									</DialogPrimitive.Close>
								</div>
							</div>

							<DialogPrimitive.Close
								className={cx(
									'absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1',
									'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
								)}
							>
								<Cross1Icon className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400" />
							</DialogPrimitive.Close>
						</DialogPrimitive.Content>
					</Transition.Child>
				</Transition.Root>
			</Portal.Root>
		</DialogPrimitive.Root>
	);
};
