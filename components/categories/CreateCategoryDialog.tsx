import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import cx from 'classnames';
import Color from 'color';
import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import { Controller, useForm } from 'react-hook-form';

import { useCreateSessionCategoryMutation } from '../../hooks/mutations/useCreateSessionCategoryMutation';
import { copy } from '../../utils/const';
import { CreateSessionCategoryPayload, CreateSessionCategorySchema } from '../../utils/schemas';
import { LoadingInner } from '../error/LoadingInner';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { DialogContent } from '../primitives/DialogContent';
import { HelpTooltip } from '../primitives/HelpTooltip';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';

interface Props {
	eid: string;
}

const CreateCategoryDialog: React.FC<Props> = (props) => {
	const { eid, children } = props;

	let [isOpen, setIsOpen] = useState(false);

	const { createSessionCategoryMutation } = useCreateSessionCategoryMutation(String(eid), {
		redirect: false
	});

	const {
		register,
		handleSubmit,
		control,
		watch,
		reset,
		formState: { errors }
	} = useForm<CreateSessionCategoryPayload>({
		defaultValues: {
			color: '#c72727'
		},
		resolver: zodResolver(CreateSessionCategorySchema)
	});

	const colorWatcher = watch('color');

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger>{children}</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen}>
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Create a Type
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					Fill out and submit the form below to create a session category to categorize your
					sessions.
				</DialogPrimitive.Description>

				<div className="mt-5 grid md:grid-cols-2 gap-5 grid-cols-1">
					<div className="">
						<Label htmlFor="name">Name *</Label>
						<Input placeholder="Session category name" {...register('name')} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div className="">
						<Label htmlFor="color">
							Color *<HelpTooltip message={copy.tooltip.typeColor} />
						</Label>
						<Controller
							control={control}
							name="color"
							render={({ field }) => (
								<ChromePicker
									disableAlpha
									color={field.value}
									onChange={(val) => {
										field.onChange(val.hex);
									}}
								/>
							)}
						/>
						{errors.color?.message && <ErrorMessage>{errors.color?.message}</ErrorMessage>}
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
					<DialogPrimitive.Close
						className={cx(
							'inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium',
							'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:text-gray-100 dark:hover:bg-primary-600',
							'border border-transparent',
							'focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-75'
						)}
						style={{
							backgroundColor: colorWatcher,
							color: Color(colorWatcher).isLight() ? '#000' : '#FFF'
						}}
						disabled={createSessionCategoryMutation.isLoading}
						onClick={handleSubmit((data) => {
							createSessionCategoryMutation.mutate(data);
							setIsOpen(false);
							reset();
						})}
					>
						{createSessionCategoryMutation.isLoading ? <LoadingInner /> : 'Create Type'}
					</DialogPrimitive.Close>
				</div>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};

export default CreateCategoryDialog;
