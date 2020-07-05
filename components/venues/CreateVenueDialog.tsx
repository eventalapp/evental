import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import cx from 'classnames';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useCreateVenueMutation } from '../../hooks/mutations/useCreateVenueMutation';
import { CreateVenuePayload, CreateVenueSchema } from '../../utils/schemas';
import { LoadingInner } from '../error/LoadingInner';
import { StyledEditor } from '../form/Editor';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { DialogContent } from '../primitives/DialogContent';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';

interface Props {
	eid: string;
}

const CreateVenueDialog: React.FC<Props> = (props) => {
	const { eid, children } = props;

	let [isOpen, setIsOpen] = useState(false);

	const { createVenueMutation } = useCreateVenueMutation(String(eid), { redirect: false });

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors }
	} = useForm<CreateVenuePayload>({
		resolver: zodResolver(CreateVenueSchema)
	});

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger>{children}</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen}>
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Create a Venue
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					Fill out and submit the form below to create a venue.
				</DialogPrimitive.Description>

				<div className="mt-5 flex w-full flex-col">
					<div className="mb-5">
						<Label htmlFor="name">Name *</Label>
						<Input placeholder="Room 415" {...register('name')} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div className="mb-5">
						<Label htmlFor="address">Address</Label>
						<Input placeholder="12345 S Jane St." {...register('address')} />
						{errors.address?.message && <ErrorMessage>{errors.address?.message}</ErrorMessage>}
					</div>

					<div className="mb-5">
						<Label htmlFor="description">Description</Label>
						<Controller
							control={control}
							name="description"
							render={({ field }) => (
								<StyledEditor
									imageUpload
									onChange={(value) => {
										field.onChange(value);
									}}
									content={field.value || ''}
								/>
							)}
						/>
						{errors.description?.message && (
							<ErrorMessage>{errors.description?.message}</ErrorMessage>
						)}
					</div>
				</div>

				<div className="mt-4 flex flex-row justify-end">
					<Button
						type="button"
						variant="no-bg"
						onClick={() => {
							setIsOpen(false);
						}}
					>
						Cancel
					</Button>
					<DialogPrimitive.Close
						className={cx(
							'inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium',
							'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:text-gray-100 dark:hover:bg-primary-600',
							'border border-transparent',
							'focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75'
						)}
						disabled={createVenueMutation.isLoading}
						onClick={handleSubmit((data) => {
							setIsOpen(false);
							createVenueMutation.mutate(data);
							reset();
						})}
					>
						{createVenueMutation.isLoading ? <LoadingInner /> : 'Create Venue'}
					</DialogPrimitive.Close>
				</div>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};

export default CreateVenueDialog;
