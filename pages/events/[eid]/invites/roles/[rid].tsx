import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { Footer } from '../../../../../components/Footer';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { Button } from '../../../../../components/form/Button';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Navigation } from '../../../../../components/navigation';
import { Heading } from '../../../../../components/typography/Heading';
import { useAcceptRoleInviteMutation } from '../../../../../hooks/mutations/useAcceptRoleInviteMutation';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { useRoleQuery } from '../../../../../hooks/queries/useRoleAttendeesQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { AcceptRoleInviteSchema } from '../../../../../utils/schemas';

const RoleInvitePage: NextPage = () => {
	const router = useRouter();
	const { user, isUserLoading } = useUser();
	const { eid, rid, code } = router.query;
	const { acceptRoleInviteMutation } = useAcceptRoleInviteMutation(String(eid), String(rid));
	const { role, roleError } = useRoleQuery(String(eid), String(rid));
	const { event, eventError } = useEventQuery(String(eid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));

	if (!user && !isUserLoading) {
		return <UnauthorizedPage />;
	}

	if (roleError) {
		return <NotFoundPage message="Role not found" />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			{role && event && (
				<NextSeo
					title={`Accept ${role.name} Invite`}
					additionalLinkTags={[
						{
							rel: 'icon',
							href: `https://cdn.evental.app${event.image}`
						}
					]}
				/>
			)}

			<Navigation />

			<Column variant="halfWidth">
				<FlexRowBetween>
					<Heading>{role ? `Accept ${role.name} Invite` : <Skeleton className="w-full" />}</Heading>
				</FlexRowBetween>

				<p className="mb-2 text-base text-gray-700">
					Roles are used to separate users into different groups.
				</p>

				<div className="flex flex-row justify-end">
					<Button type="button" variant="no-bg" onClick={router.back}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							const data = AcceptRoleInviteSchema.parse({ code: String(code) });

							acceptRoleInviteMutation.mutate(data);
						}}
					>
						Accept Invite
					</Button>
				</div>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default RoleInvitePage;
