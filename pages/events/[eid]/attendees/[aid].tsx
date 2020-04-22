import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';
import { useAttendeeQuery } from '../../../../hooks/useAttendeeQuery';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { aid, eid } = router.query;
	const { attendee, isAttendeeLoading } = useAttendeeQuery(String(eid), String(aid));

	return (
		<>
			<Head>
				<title>Viewing Attendee: {aid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				{isAttendeeLoading ? (
					<p>Loading</p>
				) : (
					<div>
						<img alt={String(attendee?.user?.name)} src={String(attendee?.user?.image)} />
						<h1 className="text-3xl">{attendee?.user?.name}</h1>
						<p>{attendee?.permissionRole}</p>
						<span className="text-md text-gray-700 block">{attendee?.user?.company}</span>
						<span className="text-md text-gray-700 block">{attendee?.user?.position}</span>
					</div>
				)}
			</Column>
		</>
	);
};

export default ViewAttendeePage;
