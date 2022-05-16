import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseCreateVenueMutationData } from '../../hooks/mutations/useCreateVenueMutation';
import { Controller, useForm } from 'react-hook-form';
import { CreateVenuePayload, CreateVenueSchema } from '../../utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '../form/ErrorMessage';
import { useRouter } from 'next/router';
import { LoadingInner } from '../error/LoadingInner';
import { StyledEditor } from '../form/Editor';

type Props = { eid: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
> &
	UseCreateVenueMutationData;

export const CreateVenueForm: React.FC<Props> = (props) => {
	const router = useRouter();

	const { createVenueMutation } = props;

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
			<div className="flex flex-col w-full mt-5">
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
					{createVenueMutation.isLoading ? <LoadingInner /> : 'Create Venue'}
				</Button>
			</div>
		</form>
	);
};
