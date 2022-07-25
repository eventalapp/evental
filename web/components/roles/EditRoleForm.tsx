import { zodResolver } from '@hookform/resolvers/zod';
import * as Prisma from '@prisma/client';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { AttendeeWithUser, EditRolePayload, EditRoleSchema, copy } from '@eventalapp/shared/utils';

import { useEditRole } from '../../hooks/mutations/useEditRole';
import { LoadingInner } from '../error/LoadingInner';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { HelpTooltip } from '../primitives/HelpTooltip';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';
import Switch from '../primitives/Switch';

type Props = {
	eid: string;
	rid: string;
	attendees: AttendeeWithUser[];
	role: Prisma.EventRole;
} & Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'role'>;

export const EditRoleForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { role, eid, rid } = props;
	const { editRoleMutation } = useEditRole(String(eid), String(rid));
	const {
		register,
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<EditRolePayload>({
		defaultValues: {
			name: role?.name ?? undefined,
			defaultRole: role?.defaultRole ?? false
		},
		resolver: zodResolver(EditRoleSchema)
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				editRoleMutation.mutate(data);
			})}
		>
			<div className="mt-5 flex w-full flex-row">
				<div className="mb-5 flex-1">
					<Label htmlFor="name">Role Name *</Label>
					<Input placeholder="Role name" {...register('name')} />
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</div>
				<div className="ml-5 flex-initial">
					<Label htmlFor="defaultRole">
						Default Role <HelpTooltip message={copy.tooltip.defaultRole} />
					</Label>
					<Controller
						control={control}
						name="defaultRole"
						render={({ field }) => (
							<Switch
								checked={field.value}
								onCheckedChange={(checked) => {
									field.onChange(checked);
								}}
							/>
						)}
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
					disabled={editRoleMutation.isLoading}
				>
					{editRoleMutation.isLoading ? <LoadingInner /> : 'Save'}
				</Button>
			</div>
		</form>
	);
};
