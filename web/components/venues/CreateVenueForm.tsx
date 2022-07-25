import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { CreateVenuePayload, CreateVenueSchema } from '@eventalapp/shared/utils';

import { useCreateVenue } from '../../hooks/mutations/useCreateVenue';
import { LoadingInner } from '../error/LoadingInner';
import { StyledEditor } from '../form/Editor';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';

type Props = { eid: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
>;

export const CreateVenueForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { eid } = props;
	const { createVenueMutation } = useCreateVenue(String(eid), { redirect: true });
	const {
		register,
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<CreateVenuePayload>({
		resolver: zodResolver(CreateVenueSchema)
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				createVenueMutation.mutate(data);
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
					type="submit"
					className="ml-4"
					variant="primary"
					padding="medium"
					disabled={createVenueMutation.isLoading}
				>
					{createVenueMutation.isLoading ? <LoadingInner /> : 'Create'}
				</Button>
			</div>
		</form>
	);
};
