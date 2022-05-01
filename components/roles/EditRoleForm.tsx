import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseEditRoleMutationData } from '../../hooks/mutations/useEditRoleMutation';
import {
	useRoleAttendeesQuery,
	UseRoleAttendeesQueryData
} from '../../hooks/queries/useRoleAttendeesQuery';
import { useRouter } from 'next/router';
import { ErrorMessage } from '../form/ErrorMessage';
import { useForm } from 'react-hook-form';
import { EditRolePayload, EditRoleSchema } from '../../utils/schemas';
import { slugify } from '../../utils/slugify';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = { eid: string } & UseRoleAttendeesQueryData &
	Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'role'> &
	UseEditRoleMutationData;

export const EditRoleForm: React.FC<Props> = (props) => {
	const router = useRouter();

	const { editRoleMutation, role, eid } = props;
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		trigger,
		formState: { errors }
	} = useForm<EditRolePayload>({
		defaultValues: {
			slug: role?.slug ?? undefined,
			name: role?.name ?? undefined,
			defaultRole: role?.defaultRole ?? false
		},
		resolver: zodResolver(EditRoleSchema)
	});

	const nameWatcher = watch('name');
	const slugWatcher = watch('slug');

	const { role: roleSlugCheck, isRoleAttendeesLoading: isRoleSlugCheckLoading } =
		useRoleAttendeesQuery(String(eid), slugWatcher);

	useEffect(() => {
		setValue('slug', slugify(nameWatcher));

		if (errors.name) {
			void trigger('slug');
		}
	}, [nameWatcher]);

	useEffect(() => {
		setValue('slug', slugify(slugWatcher));
	}, [slugWatcher]);

	if (!role) return null;

	return (
		<form
			onSubmit={handleSubmit((data) => {
				editRoleMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Role Name *</Label>
						<Input placeholder="Role name" {...register('name', { required: true })} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>
					<div>
						<Label htmlFor="slug">Role Slug *</Label>
						<Input placeholder="role-slug" {...register('slug', { required: true })} />
						{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
						{slugWatcher !== role?.slug && roleSlugCheck && (
							<ErrorMessage>This slug is already taken, please choose another</ErrorMessage>
						)}
					</div>
				</div>
				<div>
					<Label htmlFor="defaultRole">Default Role</Label>
					<Input
						type="checkbox"
						placeholder="event-slug"
						{...register('defaultRole', { required: true })}
					/>
					{errors.defaultRole?.message && (
						<ErrorMessage>{errors.defaultRole?.message}</ErrorMessage>
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
					disabled={isRoleSlugCheckLoading || Boolean(slugWatcher !== role?.slug && roleSlugCheck)}
				>
					Create Role
				</Button>
			</div>
		</form>
	);
};
