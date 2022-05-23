import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

import { UseRolesQueryData } from '../../hooks/queries/useRolesQuery';
import { capitalizeFirstLetter } from '../../utils/string';
import { NotFound } from '../error/NotFound';

type Props = {
	eid: string;
	admin?: boolean;
} & UseRolesQueryData;

export const RoleList: React.FC<Props> = (props) => {
	const { eid, roles, admin = false } = props;

	if (roles && roles.length === 0) {
		return <NotFound message="No roles found." />;
	}

	if (!roles) return null;

	return (
		<div>
			{roles.map((role, i) => (
				<Link
					href={`/events/${eid}${admin ? '/admin' : ''}/roles/${role.slug}`}
					key={role.id}
					passHref
				>
					<a>
						<div
							className={classNames(
								'p-3 py-4 border-gray-200',
								i !== roles.length - 1 && 'border-b-2'
							)}
						>
							<div className="flex flex-row justify-between items-center flex-wrap">
								<span className="text-lg block">
									{capitalizeFirstLetter(role.name.toLowerCase())}{' '}
									<span className="text-gray-500 text-md">{role.defaultRole && '(Default)'}</span>
								</span>

								<FontAwesomeIcon fill="currentColor" size="lg" icon={faChevronRight} />
							</div>
						</div>
					</a>
				</Link>
			))}
		</div>
	);
};
