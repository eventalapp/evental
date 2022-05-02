import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseCreateRoleMutationData } from '../../hooks/mutations/useCreateRoleMutation';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { CreateRolePayload, CreateRoleSchema } from '../../utils/schemas';
import { ErrorMessage } from '../form/ErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = { eid: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
> &
	UseCreateRoleMutationData;

export const CreateRoleForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { createRoleMutation } = props;
	const {
		register,
		handleSubmit,

		formState: { errors }
	} = useForm<CreateRolePayload>({
		defaultValues: {
			defaultRole: false
		},
		resolver: zodResolver(CreateRoleSchema)
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				createRoleMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Role Name *</Label>
						<Input placeholder="Role name" {...register('name')} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>
				</div>
				<div>
					<Label htmlFor="defaultRole">Default Role</Label>
					<Input type="checkbox" placeholder="event-slug" {...register('defaultRole')} />
					{errors.defaultRole?.message && (
						<ErrorMessage>{errors.defaultRole?.message}</ErrorMessage>
					)}
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button type="submit" className="ml-4" variant="primary" padding="medium">
					Create Role
				</Button>
			</div>
		</form>
	);
};
