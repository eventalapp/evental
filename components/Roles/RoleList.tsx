import type Prisma from '@prisma/client';
import Link from 'next/link';

interface Props {
	loading: boolean;
	roles: Prisma.EventRole[] | undefined;
	eid: string;
}

export const RoleList: React.FC<Props> = (props) => {
	const { eid, loading, roles } = props;

	if (loading) {
		return (
			<div>
				<p>Roles loading...</p>
			</div>
		);
	}

	if (roles?.length === 0) {
		return (
			<div>
				<p>No roles found.</p>
			</div>
		);
	}

	return (
		<div>
			{roles &&
				roles.map((role) => (
					<div key={role.id} className="py-3 border-b-2 border-gray-200">
						<Link href={`/events/${eid}/roles/${role.id}`}>
							<a>
								<span className="text-lg block">{role.role}</span>
							</a>
						</Link>
					</div>
				))}
		</div>
	);
};
