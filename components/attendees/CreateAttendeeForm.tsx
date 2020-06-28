import Color from 'color';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

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
				{event ? (
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
				) : (
					<Skeleton className="w-20 h-6" />
				)}
			</div>
		</form>
	);
};
