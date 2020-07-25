import { zodResolver } from '@hookform/resolvers/zod';
import * as Prisma from '@prisma/client';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { EditVenuePayload, EditVenueSchema } from '@eventalapp/shared/utils';

import { useEditVenue } from '../../hooks/mutations/useEditVenue';
import { LoadingInner } from '../error/LoadingInner';
import { StyledEditor } from '../form/Editor';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';

type Props = { eid: string; vid: string; venue: Prisma.EventVenue } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
>;
export const EditVenueForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { venue, eid, vid } = props;
	const { editVenueMutation } = useEditVenue(String(eid), String(vid));
	const {
		register,
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<EditVenuePayload>({
		defaultValues: {
			name: venue?.name ?? undefined,
			description: venue?.description ?? undefined,
			address: venue?.address ?? undefined
		},
		resolver: zodResolver(EditVenueSchema)
	});

	if (!venue) return null;

	return (
		<form
			onSubmit={handleSubmit((data) => {
				editVenueMutation.mutate(data);
			})}
		>
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

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					className="ml-4"
					type="submit"
					variant="primary"
					padding="medium"
					disabled={editVenueMutation.isLoading}
				>
					{editVenueMutation.isLoading ? <LoadingInner /> : 'Save'}
				</Button>
			</div>
		</form>
	);
};
