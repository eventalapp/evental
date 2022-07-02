import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useCreateRoleMutation } from '../../hooks/mutations/useCreateRoleMutation';
import { copy } from '../../utils/const';
import { CreateRolePayload, CreateRoleSchema } from '../../utils/schemas';
import { HelpTooltip } from '../HelpTooltip';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import Switch from '../radix/components/Switch';

type Props = { eid: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
>;

export const CreateRoleForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { eid } = props;
	const { createRoleMutation } = useCreateRoleMutation(String(eid));
	const {
		register,
		handleSubmit,
		control,
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
			<div className="mt-3 flex w-full flex-row">
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
					disabled={createRoleMutation.isLoading}
				>
					{createRoleMutation.isLoading ? <LoadingInner /> : 'Create Role'}
				</Button>
			</div>
		</form>
	);
};
