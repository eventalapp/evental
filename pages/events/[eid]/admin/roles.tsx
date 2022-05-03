import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { PasswordlessUser } from '../../../../utils/stripUserPassword';
import { LinkButton } from '../../../../components/form/LinkButton';
import { ssrGetUser } from '../../../../utils/api';
import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import Prisma from '@prisma/client';
import { useUser } from '../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { getRoles } from '../../../api/events/[eid]/roles';
import { Navigation } from '../../../../components/navigation';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import { RoleList } from '../../../../components/roles/RoleList';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { EventSettingsNavigation } from '../../../../components/settings/EventSettingsNavigation';

type Props = {
	initialRoles: Prisma.EventRole[] | undefined;
	initialUser: PasswordlessUser | undefined;
	initialOrganizer: boolean;
};

const RolesAdminPage: NextPage<Props> = (props) => {
	const router = useRouter();
	const { initialUser, initialRoles, initialOrganizer } = props;
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (isRolesLoading) {
		return <LoadingPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Roles</title>
			</Head>

			<Navigation />

			<Column>
				<EventSettingsNavigation eid={String(eid)} />

				<div>
					<FlexRowBetween>
						<span className="text-3xl font-bold">Roles</span>

						<div>
							<Link href={`/events/${eid}/admin/roles/create`} passHref>
								<LinkButton padding="medium">Create</LinkButton>
							</Link>
						</div>
					</FlexRowBetween>

					<RoleList
						eid={String(eid)}
						roles={roles}
						isRolesLoading={isRolesLoading}
						rolesError={rolesError}
						isOrganizer={isOrganizer}
						isOrganizerLoading={isOrganizerLoading}
					/>
				</div>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialOrganizer,
			initialRoles
		}
	};
};

export default RolesAdminPage;
