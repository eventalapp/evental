import { Transition } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';
import cx from 'classnames';
import React, { Fragment, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useCreateRoleMutation } from '../../../hooks/mutations/useCreateRoleMutation';
import { CreateRolePayload, CreateRoleSchema } from '../../../utils/schemas';
import { LoadingInner } from '../../error/LoadingInner';
import { Button } from '../../form/Button';
import { ErrorMessage } from '../../form/ErrorMessage';
import { Input } from '../../form/Input';
import { Label } from '../../form/Label';
import Switch from './Switch';

interface Props {
	eid: string;
}

const CreateRoleDialog: React.FC<Props> = (props) => {
	const { eid, children } = props;

	let [isOpen, setIsOpen] = useState(false);

	const { createRoleMutation } = useCreateRoleMutation(String(eid), { redirect: false });

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

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger>{children}</DialogPrimitive.Trigger>

			<Transition.Root show={isOpen}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<DialogPrimitive.Overlay forceMount className="fixed inset-0 z-20 bg-black/50" />
				</Transition.Child>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<DialogPrimitive.Content
						forceMount
						className={cx(
							'fixed z-50',
							'w-[95vw] max-w-2xl rounded-lg p-4 md:w-full',
							'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
							'bg-white dark:bg-gray-800',
							'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
						)}
					>
						<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
							Create a Role
						</DialogPrimitive.Title>
						<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
							Fill out and submit the form below to create a role.
						</DialogPrimitive.Description>

						<div className="flex flex-row mt-3 w-full">
							<div className="flex-1 mb-5">
								<Label htmlFor="name">Role Name *</Label>
								<Input placeholder="Role name" {...register('name')} />
								{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
							</div>

							<div className="flex-initial ml-5">
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

						<div className="flex flex-row justify-end mt-4">
							<Button
								type="button"
								variant="no-bg"
								onClick={() => {
									setIsOpen(false);
								}}
							>
								Cancel
							</Button>
							<DialogPrimitive.Close
								className={cx(
									'inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium',
									'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:text-gray-100 dark:hover:bg-primary-600',
									'border border-transparent',
									'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
								)}
								disabled={createRoleMutation.isLoading}
								onClick={handleSubmit((data) => {
									setIsOpen(false);
									createRoleMutation.mutate(data);
									reset();
								})}
							>
								{createRoleMutation.isLoading ? <LoadingInner /> : 'Create Role'}
							</DialogPrimitive.Close>
						</div>

						<DialogPrimitive.Close
							className={cx(
								'absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1',
								'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
							)}
						>
							<Cross1Icon className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400" />
						</DialogPrimitive.Close>
					</DialogPrimitive.Content>
				</Transition.Child>
			</Transition.Root>
		</DialogPrimitive.Root>
	);
};

export default CreateRoleDialog;
