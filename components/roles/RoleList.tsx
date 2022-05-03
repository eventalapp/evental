import Link from 'next/link';
import React from 'react';
import { capitalizeFirstLetter } from '../../utils/string';
import { LinkButton } from '../form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { UseRolesQueryData } from '../../hooks/queries/useRolesQuery';
import { NotFound } from '../error/NotFound';

type Props = {
	eid: string;
} & UseRolesQueryData &
	UseOrganizerQueryData;

export const RoleList: React.FC<Props> = (props) => {
	const { eid, roles, isOrganizerLoading, isOrganizer } = props;

	if (roles && roles.length === 0) {
		return <NotFound message="No roles found." />;
	}

	if (!roles) return null;

	return (
		<div>
			{roles.map((role) => (
				<div key={role.id} className="py-2 border-t-2 border-gray-200 group">
					<div className="flex flex-row justify-between items-center flex-wrap">
						<span className="text-lg block font-medium">
							{capitalizeFirstLetter(role.name.toLowerCase())}{' '}
							<span className="text-gray-500 font-normal">{role.defaultRole && '(Default)'}</span>
						</span>
						<div className="opacity-0 group-hover:opacity-100 transition-all duration-100">
							<Link href={`/events/${eid}/roles/${role.slug}`} passHref>
								<LinkButton variant="primary">View</LinkButton>
							</Link>
							{!isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/roles/${role.slug}/edit`} passHref>
									<LinkButton variant="primary" className="ml-3">
										Edit
									</LinkButton>
								</Link>
							)}
							{!isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/roles/${role.slug}/delete`} passHref>
									<LinkButton variant="primary" className="ml-3">
										Delete
									</LinkButton>
								</Link>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
