import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';
import { ViewRole } from '../../../../components/Roles/ViewRole';
import { useRoleQuery } from '../../../../hooks/useRoleQuery';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { rid, eid } = router.query;
	const { role, isRoleLoading } = useRoleQuery(String(eid), String(rid));

	return (
		<>
			<Head>
				<title>Viewing Venue: {rid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<ViewRole role={role} loading={isRoleLoading} />
			</Column>
		</>
	);
};

export default ViewAttendeePage;
