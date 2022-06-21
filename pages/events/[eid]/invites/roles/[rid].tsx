import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../components/Footer';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { Button } from '../../../../../components/form/Button';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Navigation } from '../../../../../components/navigation';
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
	const { role, isRoleLoading } = useRoleQuery(String(eid), String(rid));
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));

	if (isUserLoading || isRoleLoading || isOrganizerLoading || isEventLoading) {
		return <LoadingPage />;
	}

	if (!user) {
		return <UnauthorizedPage />;
	}

	if (!role) {
		return <NotFoundPage message="Role not found" />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (event.privacy === 'PRIVATE' && !isOrganizer) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			<NextSeo
				title={`Accept ${role.name} Invite`}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `https://cdn.evental.app${event.image}`
					}
				]}
			/>

			<Navigation />

			<Column variant="halfWidth">
				<div className="mb-3 flex flex-row justify-between">
					<h1 className="text-2xl font-bold md:text-3xl">Accept {role.name} Invite</h1>
				</div>

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

			<Footer color={event.color} />
		</PageWrapper>
	);
};

export default RoleInvitePage;
