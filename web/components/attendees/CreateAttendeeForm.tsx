import * as Prisma from '@prisma/client';
import Color from 'color';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import { UseeventRegistrationMutationData } from '../../hooks/mutations/useEventRegister';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../primitives/Button';

type Props = { event: Prisma.Event } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
> &
	UseeventRegistrationMutationData;

export const CreateAttendeeForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { eventRegistrationMutation, event } = props;
	const { handleSubmit } = useForm();

	return (
		<form
			onSubmit={handleSubmit(() => {
				eventRegistrationMutation.mutate();
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
						disabled={eventRegistrationMutation.isLoading}
						style={{
							backgroundColor: event.color,
							color: Color(event.color).isLight() ? '#000' : '#FFF'
						}}
					>
						{eventRegistrationMutation.isLoading ? <LoadingInner /> : 'Register'}
					</Button>
				) : (
					<Skeleton className="h-6 w-20" />
				)}
			</div>
		</form>
	);
};
