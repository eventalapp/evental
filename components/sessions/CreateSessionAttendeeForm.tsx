import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../form/Button';
import { useRouter } from 'next/router';
import { LoadingInner } from '../error/LoadingInner';
import { UseSessionQueryData } from '../../hooks/queries/useSessionQuery';
import { UseCreateSessionAttendeeMutationData } from '../../hooks/mutations/useCreateSessionAttendeeMutation';

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
			<div className="flex flex-row justify-end mt-3">
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
