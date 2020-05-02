import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseEditVenueMutationData } from '../../hooks/mutations/useEditVenueMutation';
import { UseVenueQueryData } from '../../hooks/queries/useVenueQuery';
import { Textarea } from '../form/Textarea';
import { useForm } from 'react-hook-form';
import { EditVenuePayload, EditVenueSchema } from '../../utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '../form/ErrorMessage';
import { useRouter } from 'next/router';

type Props = { eid: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
> &
	UseVenueQueryData &
	UseEditVenueMutationData;

export const EditVenueForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { venue, editVenueMutation } = props;

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<EditVenuePayload>({
		defaultValues: {
			name: venue?.name ?? undefined,
			description: venue?.description ?? undefined
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
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input placeholder="Venue name" {...register('name')} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>
				</div>

				<div className="grid grid-cols-1 mb-5 gap-5">
					<div>
						<Label htmlFor="description">Description</Label>
						<Textarea rows={5} placeholder="Venue description" {...register('description')} />
						{errors.description?.message && (
							<ErrorMessage>{errors.description?.message}</ErrorMessage>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button className="ml-4" type="submit" variant="primary" padding="medium">
					Edit Venue
				</Button>
			</div>
		</form>
	);
};
