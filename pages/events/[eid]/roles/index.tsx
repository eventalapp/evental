import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { Navigation } from '../../../../components/navigation';
import { RoleList } from '../../../../components/roles/RoleList';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import Link from 'next/link';
import { LinkButton } from '../../../../components/form/LinkButton';
import React from 'react';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../components/layout/PageWrapper';

import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import Prisma from '@prisma/client';

import { getRoles } from '../../../api/events/[eid]/roles';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewNextkitErrorPage } from '../../../../components/error/ViewNextkitErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import user from '../../../api/auth/user';
import { PasswordlessUser } from '../../../../utils/api';

type Props = {
	initialRoles: Prisma.EventRole[] | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
};

const RolesPage: NextPage<Props> = (props) => {
	const { initialRoles, initialOrganizer } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(
		String(eid),
		initialOrganizer
	);

	if (!initialRoles || !roles) {
		return <NotFoundPage message="No roles found." />;
	}

	if (isOrganizerLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (isOrganizerError || rolesError) {
		return <ViewNextkitErrorPage errors={[isOrganizerError, rolesError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Roles Page</title>
			</Head>

			<Navigation />

			<Column>
				<FlexRowBetween>
					<h1 className="text-3xl font-bold">Roles</h1>

					{!isOrganizerError && !isOrganizerLoading && isOrganizer && (
						<Link href={`/events/${eid}/admin/roles/create`} passHref>
							<LinkButton>Create role</LinkButton>
						</Link>
					)}
				</FlexRowBetween>

				<RoleList
					eid={String(eid)}
					roles={roles}
					isOrganizerError={isOrganizerError}
					isOrganizerLoading={isOrganizerLoading}
					isOrganizer={isOrganizer}
					isRolesLoading={isRolesLoading}
					rolesError={rolesError}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const session = await getSession(context);
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialOrganizer = await getIsOrganizer(user.id, String(eid));

	return {
		props: {
			session,
			initialRoles,
			initialOrganizer
		}
	};
};

export default RolesPage;
