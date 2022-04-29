import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AdminEditAttendeePayload, AdminEditAttendeeSchema } from '../../utils/schemas';
import { Button } from '../form/Button';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { Textarea } from '../form/Textarea';
import { useAttendeeQuery, UseAttendeeQueryData } from '../../hooks/queries/useAttendeeQuery';
import { slugify } from '../../utils/slugify';
import { UseEditAttendeeMutationData } from '../../hooks/mutations/useAdminEditAttendeeMutation';
import { UseRolesQueryData } from '../../hooks/queries/useRolesQuery';
import { Select } from '../form/Select';
import Link from 'next/link';
import { EventPermissionRole } from '@prisma/client';

type Props = { eid: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
> &
	UseEditAttendeeMutationData &
	UseAttendeeQueryData &
	UseRolesQueryData;

export const AdminEditAttendeeForm: React.FC<Props> = (props) => {
	const { adminEditAttendeeMutation, attendee, roles, eid } = props;
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		trigger,
		formState: { errors }
	} = useForm<AdminEditAttendeePayload>({
		defaultValues: {
			name: attendee?.name ?? undefined,
			description: attendee?.description ?? undefined,
			company: attendee?.company ?? undefined,
			image: attendee?.image ?? undefined,
			position: attendee?.position ?? undefined,
			location: attendee?.location ?? undefined,
			slug: attendee?.slug ?? undefined,
			eventRoleId: attendee?.eventRoleId ?? undefined,
			permissionRole: attendee?.permissionRole ?? undefined
		},
		resolver: zodResolver(AdminEditAttendeeSchema)
	});

	const nameWatcher = watch('name');
	const slugWatcher = watch('slug');

	const { attendee: attendeeSlugCheck, isAttendeeLoading: isAttendeeSlugCheckLoading } =
		useAttendeeQuery(String(eid), slugWatcher);

	useEffect(() => {
		setValue('slug', slugify(nameWatcher));

		if (errors.name) {
			void trigger('slug');
		}
	}, [nameWatcher]);

	useEffect(() => {
		setValue('slug', slugify(slugWatcher));
	}, [slugWatcher]);

	return (
		<form
			onSubmit={handleSubmit((data) => {
				adminEditAttendeeMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input placeholder="Full Name" {...register('name', { required: true })} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="location">Location</Label>
						<Input placeholder="Location" {...register('location', { required: true })} />
						{errors.location?.message && <ErrorMessage>{errors.location?.message}</ErrorMessage>}
					</div>
				</div>
			</div>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="position">Position</Label>
						<Input placeholder="Position" {...register('position', { required: true })} />
						{errors.position?.message && <ErrorMessage>{errors.position?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="company">Company</Label>
						<Input placeholder="Company" {...register('company', { required: true })} />
						{errors.company?.message && <ErrorMessage>{errors.company?.message}</ErrorMessage>}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 mb-5 gap-5">
				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea
						rows={5}
						placeholder="Event description"
						{...register('description', { required: true })}
					/>
					{errors.description?.message && (
						<ErrorMessage>{errors.description?.message}</ErrorMessage>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
				<div>
					<div>
						<Label htmlFor="slug">Slug</Label>
						<div className="flex items-center">
							<span className="mr-1 text-md">/attendees/</span>
							<Input placeholder="attendee-slug" {...register('slug', { required: true })} />
						</div>
						{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
						{slugWatcher !== attendee?.slug && attendeeSlugCheck && (
							<ErrorMessage>This slug is already taken, please choose another</ErrorMessage>
						)}
					</div>
				</div>

				<div>
					<Label htmlFor="eventRoleId">Role</Label>
					<Select {...register('eventRoleId', { required: true })}>
						{roles &&
							roles.map((role) => (
								<option key={role.id} value={role.id}>
									{role.name}
								</option>
							))}
					</Select>
					<Link href={`/events/${eid}/admin/roles/create`}>
						<a className="text-gray-600 block mt-1 text-sm">Dont see your role? Create a role</a>
					</Link>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
				<div>
					<Label htmlFor="permissionRole">Permission Role</Label>
					<Select {...register('permissionRole', { required: true })}>
						{EventPermissionRole &&
							Object.values(EventPermissionRole).map((role) => (
								<option key={role} value={role}>
									{role}
								</option>
							))}
					</Select>
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button
					type="submit"
					variant="primary"
					padding="medium"
					disabled={
						isAttendeeSlugCheckLoading ||
						Boolean(slugWatcher !== attendee?.slug && attendeeSlugCheck)
					}
				>
					Edit
					<FontAwesomeIcon fill="currentColor" className="ml-2" size="1x" icon={faChevronRight} />
				</Button>
			</div>
		</form>
	);
};
