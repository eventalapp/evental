import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { CreateVenuePayload, CreateVenueSchema } from '@eventalapp/shared/utils';

import { useCreateVenue } from '../../hooks/mutations/useCreateVenue';
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

	const { createVenueMutation } = useCreateVenue(String(eid), { redirect: false });

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors }
	} = useForm<CreateVenuePayload>({
		resolver: zodResolver(CreateVenueSchema)
	});

	useEffect(() => {
		if (createVenueMutation.isSuccess) {
			setIsOpen(false);
			reset();
		}
	}, [createVenueMutation.isSuccess]);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger>{children}</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen} size="lg">
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

					<Button
						variant="primary"
						onClick={handleSubmit((data) => {
							createVenueMutation.mutate(data);
						})}
						disabled={createVenueMutation.isLoading}
					>
						{createVenueMutation.isLoading ? <LoadingInner /> : 'Create'}
					</Button>
				</div>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};

export default CreateVenueDialog;
