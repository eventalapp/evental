import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseEditVenueMutationData } from '../../hooks/mutations/useEditVenueMutation';
import { useVenueQuery, UseVenueQueryData } from '../../hooks/queries/useVenueQuery';
import { Textarea } from '../form/Textarea';
import { useForm } from 'react-hook-form';
import { EditVenuePayload, EditVenueSchema } from '../../utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '../form/ErrorMessage';
import { slugify } from '../../utils/slugify';

type Props = { eid: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
> &
	UseVenueQueryData &
	UseEditVenueMutationData;

export const EditVenueForm: React.FC<Props> = (props) => {
	const { venue, editVenueMutation, eid } = props;

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		trigger,
		formState: { errors }
	} = useForm<EditVenuePayload>({
		defaultValues: {
			name: venue?.name ?? undefined,
			description: venue?.description ?? undefined,
			slug: venue?.slug ?? undefined
		},
		resolver: zodResolver(EditVenueSchema)
	});

	const nameWatcher = watch('name');
	const slugWatcher = watch('slug');

	const { venue: venueSlugCheck, isVenueLoading: isVenueSlugCheckLoading } = useVenueQuery(
		String(eid),
		slugWatcher
	);

	useEffect(() => {
		setValue('slug', slugify(nameWatcher));

		if (errors.name) {
			void trigger('slug');
		}
	}, [nameWatcher]);

	useEffect(() => {
		setValue('slug', slugify(slugWatcher));
	}, [slugWatcher]);

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
						<Input placeholder="Venue name" {...register('name', { required: true })} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="slug">Slug</Label>
						<Input placeholder="venue-slug" {...register('slug', { required: true })} />
						{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
						{slugWatcher !== venue?.slug && venueSlugCheck && (
							<ErrorMessage>This slug is already taken, please choose another</ErrorMessage>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 mb-5 gap-5">
					<div>
						<Label htmlFor="description">Description</Label>
						<Textarea
							rows={5}
							placeholder="Venue description"
							{...register('description', { required: true })}
						/>
						{errors.description?.message && (
							<ErrorMessage>{errors.description?.message}</ErrorMessage>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button
					type="submit"
					variant="primary"
					padding="medium"
					disabled={
						isVenueSlugCheckLoading || Boolean(slugWatcher !== venue?.slug && venueSlugCheck)
					}
				>
					Edit Venue
				</Button>
			</div>
		</form>
	);
};
