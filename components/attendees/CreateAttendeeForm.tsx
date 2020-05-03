import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../form/Button';
import { UseEventQueryData } from '../../hooks/queries/useEventQuery';

import { UseCreateAttendeeMutationData } from '../../hooks/mutations/useCreateAttendeeMutation';
import { useRouter } from 'next/router';
import { LoadingInner } from '../error/LoadingInner';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseEventQueryData &
	UseCreateAttendeeMutationData;

export const CreateAttendeeForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { createAttendeeMutation } = props;
	const { handleSubmit } = useForm();

	return (
		<form
			onSubmit={handleSubmit(() => {
				createAttendeeMutation.mutate();
			})}
		>
			<div className="flex flex-row justify-end mt-3">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					type="submit"
					className="ml-4"
					variant="primary"
					padding="medium"
					disabled={createAttendeeMutation.isLoading}
				>
					{createAttendeeMutation.isLoading ? <LoadingInner /> : 'Register'}
				</Button>
			</div>
		</form>
	);
};
