import React from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { ErrorMessage } from '../form/ErrorMessage';
import { Controller, useForm } from 'react-hook-form';
import { CreateSessionTypePayload, CreateSessionTypeSchema } from '../../utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { LoadingInner } from '../error/LoadingInner';
import { UseCreateSessionTypeMutationData } from '../../hooks/mutations/useCreateSessionTypeMutation';
import { CirclePicker } from 'react-color';
import { colors } from '../../utils/const';

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
			<div className="flex flex-row w-full mt-5 flex-wrap">
				<div className="flex-1 flex-grow md:mr-5">
					<Label htmlFor="name">Name *</Label>
					<Input placeholder="Session type name" {...register('name')} />
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</div>

				<div className="flex-initial w-full md:w-auto my-5 md:mt-0">
					<Label htmlFor="color">Color *</Label>
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
