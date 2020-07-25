import { zodResolver } from '@hookform/resolvers/zod';
import Color from 'color';
import { useRouter } from 'next/router';
import React from 'react';
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
import { HelpTooltip } from '../primitives/HelpTooltip';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';

type Props = { eid: string };

export const CreateSessionCategoryForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { eid } = props;
	const { createSessionCategoryMutation } = useCreateSessionCategory(String(eid));

	const {
		register,
		handleSubmit,
		control,
		watch,
		formState: { errors }
	} = useForm<CreateSessionCategoryPayload>({
		defaultValues: {
			color: '#b40000'
		},
		resolver: zodResolver(CreateSessionCategorySchema)
	});

	const colorWatcher = watch('color');

	return (
		<form
			onSubmit={handleSubmit((data) => {
				createSessionCategoryMutation.mutate(data);
			})}
		>
			<div className="my-5 grid grid-flow-row-dense grid-cols-4 gap-5">
				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="name">Name *</Label>
					<Input placeholder="Session category name" {...register('name')} />
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
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

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					type="submit"
					variant="primary"
					className="ml-4"
					padding="medium"
					disabled={createSessionCategoryMutation.isLoading}
					style={{
						backgroundColor: colorWatcher,
						color: Color(colorWatcher).isLight() ? '#000' : '#FFF'
					}}
				>
					{createSessionCategoryMutation.isLoading ? <LoadingInner /> : 'Create'}
				</Button>
			</div>
		</form>
	);
};
