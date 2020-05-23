import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { LoadingPage } from '../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { Button } from '../../../../components/form/Button';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { Navigation } from '../../../../components/navigation';
import { useAcceptOrganizerInviteMutation } from '../../../../hooks/mutations/useAcceptOrganizerInviteMutation';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import { AcceptOrganizerInviteSchema } from '../../../../utils/schemas';

const OrganizerInvitePage: NextPage = () => {
	const router = useRouter();
	const { user, isUserLoading } = useUser();
	const { eid, code } = router.query;
	const { acceptOrganizerInviteMutation } = useAcceptOrganizerInviteMutation(String(eid));
	const { event, isEventLoading } = useEventQuery(String(eid));

	if (isUserLoading || isEventLoading) {
		return <LoadingPage />;
	}

	if (!event) {
		return <NotFoundPage message={'Event not found.'} />;
	}
	if (!user) {
		return <UnauthorizedPage />;
	}

	return (
		<PageWrapper variant="gray">
			<NextSeo
				title={`Accept Organizer Invite`}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `https://cdn.evental.app${event.image}`
					}
				]}
			/>

			<Navigation />

			<Column variant="halfWidth">
				<div className="flex flex-row justify-between mb-3">
					<h1 className="text-2xl md:text-3xl font-bold">Accept Organizer Invite</h1>
				</div>

				<p className="text-md text-gray-700 mb-2">
					As an organizer you will be able to create, edit, and delete sessions, venues, and roles.
				</p>

				<div className="flex flex-row justify-end">
					<Button type="button" variant="no-bg" onClick={router.back}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							const data = AcceptOrganizerInviteSchema.parse({ code: String(code) });

							acceptOrganizerInviteMutation.mutate(data);
						}}
					>
						Accept Invite
					</Button>
				</div>
			</Column>
		</PageWrapper>
	);
};

export default OrganizerInvitePage;
