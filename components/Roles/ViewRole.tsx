import type Prisma from '@prisma/client';
import Link from 'next/link';
import { LinkButton } from '../Form/LinkButton';

interface Props {
	eid: string;
	loading: boolean;
	role: Prisma.EventRole | undefined;
}

export const ViewRole: React.FC<Props> = (props) => {
	const { eid, loading, role } = props;

	if (loading) {
		return (
			<div>
				<p>Roles loading...</p>
			</div>
		);
	}

	return (
		<div>
			{loading ? (
				<p>Loading Venue...</p>
			) : (
				role && (
					<div>
						<h1 className="text-3xl">{role.name}</h1>
						<Link href={`/events/${eid}/attendees/${role.id}`} passHref>
							<LinkButton>View Role Members</LinkButton>
						</Link>
					</div>
				)
			)}
		</div>
	);
};
