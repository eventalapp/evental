import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';

import { UseCreateSessionAttendeeMutationData } from '../../hooks/mutations/useCreateSessionAttendeeMutation';
import { UseSessionQueryData } from '../../hooks/queries/useSessionQuery';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseSessionQueryData &
	UseCreateSessionAttendeeMutationData;

export const CreateSessionAttendeeForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { createSessionAttendeeMutation } = props;
	const { handleSubmit } = useForm();

	return (
		<form
			onSubmit={handleSubmit(() => {
				createSessionAttendeeMutation.mutate();
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
					disabled={createSessionAttendeeMutation.isLoading}
				>
					{createSessionAttendeeMutation.isLoading ? <LoadingInner /> : 'Register'}
				</Button>
			</div>
		</form>
	);
};
