import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import Color from 'color';
import React, { useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import { Controller, useForm } from 'react-hook-form';

import {
	CreateSessionCategoryPayload,
	CreateSessionCategorySchema,
	copy
} from '@eventalapp/shared/utils';

import { useCreateSessionCategory } from '../../hooks/mutations/useCreateSessionCategory';
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

	const { createSessionCategoryMutation } = useCreateSessionCategory(String(eid), {
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

	useEffect(() => {
		if (createSessionCategoryMutation.isSuccess) {
			setIsOpen(false);
			reset();
		}
	}, [createSessionCategoryMutation.isSuccess]);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger>{children}</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen} size="lg">
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Create a Category
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					Fill out and submit the form below to create a session category to categorize your
					sessions.
				</DialogPrimitive.Description>

				<div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
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

					<Button
						type="submit"
						className="ml-4"
						variant="primary"
						padding="medium"
						disabled={createSessionCategoryMutation.isLoading}
						style={{
							backgroundColor: colorWatcher,
							color: Color(colorWatcher).isLight() ? '#000' : '#FFF'
						}}
						onClick={handleSubmit((data) => {
							createSessionCategoryMutation.mutate(data);
						})}
					>
						{createSessionCategoryMutation.isLoading ? <LoadingInner /> : 'Create'}
					</Button>
				</div>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};

export default CreateCategoryDialog;
