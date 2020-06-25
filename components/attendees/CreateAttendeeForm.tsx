import Color from 'color';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';

import { UseCreateAttendeeMutationData } from '../../hooks/mutations/useCreateAttendeeMutation';
import { UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseEventQueryData &
	UseCreateAttendeeMutationData;

export const CreateAttendeeForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { createAttendeeMutation, event } = props;
	const { handleSubmit } = useForm();

	if (!event) return null;

	return (
		<form
			onSubmit={handleSubmit(() => {
				createAttendeeMutation.mutate();
			})}
		>
			<div className="mt-3 flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					type="submit"
					className="ml-4"
					variant="primary"
					padding="medium"
					disabled={createAttendeeMutation.isLoading}
					style={{
						backgroundColor: event.color,
						color: Color(event.color).isLight() ? '#000' : '#FFF'
					}}
				>
					{createAttendeeMutation.isLoading ? <LoadingInner /> : 'Register'}
				</Button>
			</div>
		</form>
	);
};
