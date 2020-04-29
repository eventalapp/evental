import Link from 'next/link';
import React from 'react';
import { capitalizeFirstLetter } from '../../utils/string';
import { LinkButton } from '../form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { UseRolesQueryData } from '../../hooks/queries/useRolesQuery';
import { Loading } from '../Loading';
import { ViewServerError } from '../ViewServerError';
import { NotFound } from '../NotFound';
import PageWrapper from '../layout/PageWrapper';

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
		return <ViewServerError errors={[isOrganizerError, rolesError]} />;
	}

	if (!roles || roles?.length === 0) {
		return <NotFound />;
	}

	return (
		<div>
			{roles.map((role) => (
				<div key={role.id} className="py-2 border-t-2 border-gray-200">
					<div className="flex flex-row justify-between items-center flex-wrap">
						<span className="text-lg block">
							{capitalizeFirstLetter(role.name.toLowerCase())}{' '}
							<span className="font-bold">{role.defaultRole && '(Default)'}</span>
						</span>
						<div>
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
