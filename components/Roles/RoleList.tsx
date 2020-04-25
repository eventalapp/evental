import Link from 'next/link';
import React from 'react';
import { capitalizeFirstLetter } from '../../utils/string';
import { LinkButton } from '../Form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { UseRolesQueryData } from '../../hooks/queries/useRolesQuery';
import { Loading } from '../Loading';
import { ServerError } from '../ServerError';
import { NotFound } from '../NotFound';

type Props = {
	eid: string;
} & UseRolesQueryData &
	UseOrganizerQueryData;

export const RoleList: React.FC<Props> = (props) => {
	const {
		eid,
		roles,
		isRolesLoading,
		rolesError,
		isOrganizerLoading,
		isOrganizerError,
		isOrganizer
	} = props;

	if (isOrganizerLoading || isRolesLoading) {
		return <Loading />;
	}

	if (isOrganizerError || rolesError) {
		return <ServerError errors={[isOrganizerError, rolesError]} />;
	}

	if (!roles || roles?.length === 0) {
		return <NotFound />;
	}

	return (
		<div>
			{roles.map((role) => (
				<div key={role.id} className="py-2 border-t-2 border-gray-200">
					<div className="flex flex-row justify-between items-center">
						<span className="text-lg block">
							{capitalizeFirstLetter(role.name.toLowerCase())}{' '}
							<span className="font-bold">{role.defaultRole && '(Default)'}</span>
						</span>
						<div>
							<Link href={`/events/${eid}/roles/${role.slug}`} passHref>
								<LinkButton variant="secondary">View</LinkButton>
							</Link>
							{!isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/roles/${role.slug}/edit`} passHref>
									<LinkButton variant="secondary" className="ml-3">
										Edit
									</LinkButton>
								</Link>
							)}
							{!isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/roles/${role.slug}/delete`} passHref>
									<LinkButton variant="secondary" className="ml-3">
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
