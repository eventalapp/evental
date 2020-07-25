import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { CreateRolePayload, CreateRoleSchema } from '@eventalapp/shared/utils';

import { useCreateRole } from '../../hooks/mutations/useCreateRole';
import { LoadingInner } from '../error/LoadingInner';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { DialogContent } from '../primitives/DialogContent';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';
import Switch from '../primitives/Switch';

interface Props {
	eid: string;
}

const CreateRoleDialog: React.FC<Props> = (props) => {
	const { eid, children } = props;

	let [isOpen, setIsOpen] = useState(false);

	const { createRoleMutation } = useCreateRole(String(eid), { redirect: false });

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset
	} = useForm<CreateRolePayload>({
		defaultValues: {
			defaultRole: false
		},
		resolver: zodResolver(CreateRoleSchema)
	});

	useEffect(() => {
		if (createRoleMutation.isSuccess) {
			setIsOpen(false);
			reset();
		}
	}, [createRoleMutation.isSuccess]);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger>{children}</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen} size="lg">
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Create a Role
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					Fill out and submit the form below to create a role.
				</DialogPrimitive.Description>

				<div className="mt-3 flex w-full flex-row">
					<div className="mb-5 flex-1">
						<Label htmlFor="name">Role Name *</Label>
						<Input placeholder="Role name" {...register('name')} autoFocus />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div className="ml-5 flex-initial">
						<Label htmlFor="defaultRole">Default Role</Label>
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

				<div className="mt-4 flex flex-row justify-end">
					<Button
						type="button"
						variant="no-bg"
						onClick={() => {
							setIsOpen(false);
						}}
					>
						Cancel
					</Button>

					<Button
						variant="primary"
						onClick={handleSubmit((data) => {
							createRoleMutation.mutate(data);
						})}
						disabled={createRoleMutation.isLoading}
					>
						{createRoleMutation.isLoading ? <LoadingInner /> : 'Create'}
					</Button>
				</div>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};

export default CreateRoleDialog;
