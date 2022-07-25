import * as Prisma from '@prisma/client';
import Color from 'color';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

import { useEventRegister } from '@eventalapp/shared/hooks';

import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../primitives/Button';

type Props = { event: Prisma.Event; eid: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
>;
export const CreateAttendeeForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { event, eid } = props;
	const { handleSubmit } = useForm();

	const { mutate: eventRegister, isLoading: isEventRegistrationLoading } = useEventRegister({
		eid: String(eid),
		onSuccess: () => {
			toast.success('You have successfully registered for this event.');
		},
		onError: (error) => {
			toast.error(error?.message ?? 'An error has occurred.');
		}
	});

	return (
		<form
			onSubmit={handleSubmit(() => {
				eventRegister();
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
						disabled={isEventRegistrationLoading}
						style={{
							backgroundColor: event.color,
							color: Color(event.color).isLight() ? '#000' : '#FFF'
						}}
					>
						{isEventRegistrationLoading ? <LoadingInner /> : 'Register'}
					</Button>
				) : (
					<Skeleton className="h-6 w-20" />
				)}
			</div>
		</form>
	);
};
