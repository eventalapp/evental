import * as Prisma from '@prisma/client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import Color from 'color';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useEventRegister } from '@eventalapp/shared/hooks';
import { StrippedUser } from '@eventalapp/shared/utils';

import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../primitives/Button';
import { DialogContent } from '../primitives/DialogContent';
import { LinkButton } from '../primitives/LinkButton';

interface Props {
	event: Prisma.Event;
	user: StrippedUser | undefined;
}

export const EventRegistrationDialog: React.FC<Props> = (props) => {
	const { children, event, user } = props;

	let [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const {
		mutate: eventRegistration,
		isSuccess: isRegistrationSuccess,
		isLoading: isRegistrationLoading
	} = useEventRegister({
		eid: String(event.slug),
		onSuccess: () => {
			toast.success('You have successfully registered for this event.');
		},
		onError: (error) => {
			toast.error(error?.message ?? 'An error has occurred.');
		}
	});

	let params = new URLSearchParams();

	params.append('redirectUrl', String(router.asPath));

	useEffect(() => {
		if (isRegistrationSuccess) {
			setIsOpen(false);
		}
	}, [isRegistrationSuccess]);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen} size="lg">
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Register for {event.name}
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					{user
						? 'To attend this event, please click the register button below.'
						: 'To attend this event, please create an account.'}
				</DialogPrimitive.Description>

				<div className="mt-4 flex flex-row justify-end">
					<Button
						type="button"
						variant="no-bg"
						onClick={() => {
							setIsOpen(false);
						}}
					>
						Cancel
					</Button>

					{user ? (
						<Button
							type="submit"
							className="ml-4"
							variant="primary"
							padding="medium"
							disabled={isRegistrationLoading}
							style={{
								backgroundColor: event.color,
								color: Color(event.color).isLight() ? '#000' : '#FFF'
							}}
							onClick={() => {
								eventRegistration();
							}}
						>
							{isRegistrationLoading ? <LoadingInner /> : 'Register'}
						</Button>
					) : (
						<Link href={`/auth/signin?${params}`} passHref>
							<LinkButton
								type="submit"
								className="ml-4"
								variant="primary"
								padding="medium"
								style={{
									backgroundColor: event.color,
									color: Color(event.color).isLight() ? '#000' : '#FFF'
								}}
							>
								Create Account
							</LinkButton>
						</Link>
					)}
				</div>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};
