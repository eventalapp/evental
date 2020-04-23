import type Prisma from '@prisma/client';
import Link from 'next/link';
import React from 'react';
import { capitalizeFirstLetter } from '../../utils/string';
import { LinkButton } from '../Form/LinkButton';
import { useOrganizerQuery } from '../../hooks/queries/useOrganizerQuery';

interface Props {
	loading: boolean;
	roles: Prisma.EventRole[] | undefined;
	eid: string;
}

export const RoleList: React.FC<Props> = (props) => {
	const { eid, loading, roles } = props;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));

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
					<div key={role.id} className="py-2 border-t-2 border-gray-200">
						<div className="flex flex-row justify-between items-center">
							<span className="text-lg block">
								{capitalizeFirstLetter(role.name.toLowerCase())}
							</span>
							<div>
								<Link href={`/events/${eid}/roles/${role.slug}`} passHref>
									<LinkButton variant={'secondary'} className="mr-3">
										View
									</LinkButton>
								</Link>
								{!isOrganizerLoading && isOrganizer && (
									<Link href={`/events/${eid}/admin/roles/${role.slug}/edit`} passHref>
										<LinkButton variant={'secondary'}>Edit</LinkButton>
									</Link>
								)}
							</div>
						</div>
					</div>
				))}
		</div>
	);
};
