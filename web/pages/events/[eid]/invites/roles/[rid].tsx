import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

import {
	useAcceptRoleInvite,
	useEvent,
	useIsOrganizer,
	useRole,
	useUser
} from '@eventalapp/shared/hooks';
import { AcceptRoleInviteSchema } from '@eventalapp/shared/utils';

import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import { Footer } from '../../../../../components/layout/Footer';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Navigation } from '../../../../../components/navigation';
import { Button } from '../../../../../components/primitives/Button';
import { Heading } from '../../../../../components/primitives/Heading';
import { LinkButton } from '../../../../../components/primitives/LinkButton';

const RoleInvitePage: NextPage = () => {
	const router = useRouter();
	const { data: user } = useUser();
	const { eid, rid, code } = router.query;
	const { mutate: acceptRoleInvite } = useAcceptRoleInvite({
		eid: String(eid),
		rid: String(rid),
		onSuccess: () => {
			router.push(`/events/${eid}`).then(() => {
				toast.success('You have joined this event.');
			});
		},
		onError: (error) => {
			toast.error(error?.message ?? 'An error has occurred.');
		}
	});
	const { data: role, error: roleError } = useRole({ eid: String(eid), rid: String(rid) });
	const { data: event, error: eventError } = useEvent({ eid: String(eid) });
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });

	const Seo = role && event && (
		<NextSeo
			title={`Accept ${role.name} Invite`}
			additionalLinkTags={[
				{
					rel: 'icon',
					href: `https://cdn.evental.app${event.image}`
				}
			]}
		/>
	);

	if (roleError) {
		return <NotFoundPage message="Role not found" />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	if (!user?.id) {
		let params = new URLSearchParams();

		params.append('redirectUrl', String(router.asPath));

		return (
			<>
				{Seo}

				<Navigation />

				<PageWrapper>
					<Column variant="halfWidth">
						<div className="space-y-5">
							<Heading>Create an account</Heading>
							<p className="text-gray-700">
								To join this event as a {role && role.name}, please{' '}
								<Link href={`/auth/signup?${params}`}>
									<a className="text-gray-900 underline">create an account</a>
								</Link>{' '}
								or{' '}
								<Link href={`/auth/signin?${params}`}>
									<a className="text-gray-900 underline">sign in</a>
								</Link>{' '}
								with your existing account.
							</p>
							<div className="flex flex-row justify-end">
								<Button type="button" variant="no-bg" className="mr-3" onClick={router.back}>
									Cancel
								</Button>

								<Link href={`/auth/signin?${params}`} passHref>
									<LinkButton padding="large" variant="primary">
										Sign in
									</LinkButton>
								</Link>
							</div>
						</div>
					</Column>
				</PageWrapper>

				<Footer color={event?.color} />
			</>
		);
	}

	return (
		<>
			{Seo}

			<Navigation />

			<PageWrapper>
				<Column variant="halfWidth">
					<FlexRowBetween>
						<Heading>
							{role ? `Accept ${role.name} Invite` : <Skeleton className="w-full" />}
						</Heading>
					</FlexRowBetween>

					<p className="mb-2 text-base text-gray-700">
						Roles are used to separate users into different groups.
					</p>

					<div className="flex flex-row justify-end">
						<Button type="button" variant="no-bg" onClick={router.back}>
							Cancel
						</Button>
						<Button
							variant="primary"
							onClick={() => {
								const data = AcceptRoleInviteSchema.parse({ code: String(code) });

								acceptRoleInvite(data);
							}}
						>
							Accept Invite
						</Button>
					</div>
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default RoleInvitePage;
