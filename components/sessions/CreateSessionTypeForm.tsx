import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React from 'react';
import { CirclePicker } from 'react-color';
import { Controller, useForm } from 'react-hook-form';

import { UseCreateSessionTypeMutationData } from '../../hooks/mutations/useCreateSessionTypeMutation';
import { colors, copy } from '../../utils/const';
import { CreateSessionTypePayload, CreateSessionTypeSchema } from '../../utils/schemas';
import { HelpTooltip } from '../HelpTooltip';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';

type Props = UseCreateSessionTypeMutationData;

export const CreateSessionTypeForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { createSessionTypeMutation } = props;
	const {
		register,
		handleSubmit,
		control,
		watch,
		formState: { errors }
	} = useForm<CreateSessionTypePayload>({
		defaultValues: {
			color: colors[0]
		},
		resolver: zodResolver(CreateSessionTypeSchema)
	});

	const colorWatcher = watch('color');

	return (
		<form
			onSubmit={handleSubmit((data) => {
				createSessionTypeMutation.mutate(data);
			})}
		>
			<div className="mt-5 flex w-full flex-row flex-wrap">
				<div className="flex-1 flex-grow md:mr-5">
					<Label htmlFor="name">Name *</Label>
					<Input placeholder="Session type name" {...register('name')} />
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</div>

				<div className="my-5 w-full flex-initial md:mt-0 md:w-auto">
					<Label htmlFor="color">
						Color *<HelpTooltip message={copy.tooltip.typeColor} />
					</Label>
					<Controller
						control={control}
						name="color"
						render={({ field }) => (
							<CirclePicker
								colors={colors}
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
					disabled={createSessionTypeMutation.isLoading}
					style={{ backgroundColor: colorWatcher, color: '#000000' }}
				>
					{createSessionTypeMutation.isLoading ? <LoadingInner /> : 'Create Session Type'}
				</Button>
			</div>
		</form>
	);
};
