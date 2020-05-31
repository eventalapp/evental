import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { CirclePicker } from 'react-color';
import { Controller, useForm } from 'react-hook-form';

import { UseEditSessionTypeMutationData } from '../../hooks/mutations/useEditSessionTypeMutation';
import { UseSessionTypeQueryData } from '../../hooks/queries/useSessionTypeQuery';
import { colors, copy } from '../../utils/const';
import { EditSessionTypePayload, EditSessionTypeSchema } from '../../utils/schemas';
import { HelpTooltip } from '../HelpTooltip';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseEditSessionTypeMutationData &
	UseSessionTypeQueryData;

export const EditSessionTypeForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { editSessionTypeMutation, sessionType } = props;
	const {
		register,
		handleSubmit,
		control,
		watch,
		formState: { errors }
	} = useForm<EditSessionTypePayload>({
		defaultValues: {
			name: String(sessionType?.name),
			color: String(sessionType?.color) ?? colors[0]
		},
		resolver: zodResolver(EditSessionTypeSchema)
	});

	const colorWatcher = watch('color');

	return (
		<form
			onSubmit={handleSubmit((data) => {
				editSessionTypeMutation.mutate(data);
			})}
		>
			<div className="flex flex-row w-full mt-5 flex-wrap">
				<div className="flex-1 flex-grow md:mr-5">
					<Label htmlFor="name">Name *</Label>
					<Input placeholder="Session type name" {...register('name')} />
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</div>

				<div className="flex-initial w-full md:w-auto my-5 md:mt-0">
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
					disabled={editSessionTypeMutation.isLoading}
					style={{ backgroundColor: colorWatcher, color: '#000000' }}
				>
					{editSessionTypeMutation.isLoading ? <LoadingInner /> : 'Edit Session Type'}
				</Button>
			</div>
		</form>
	);
};
