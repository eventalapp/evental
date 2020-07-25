import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Prisma from '@prisma/client';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

import { capitalizeFirstLetter } from '@eventalapp/shared/utils';

import { NotFound } from '../error/NotFound';
import Tooltip from '../primitives/Tooltip';

type Props = {
	eid: string;
	admin?: boolean;
	roles: Prisma.EventRole[];
};

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
						<div className={classNames('border-gray-200', i !== roles.length - 1 && 'border-b')}>
							<div className="-mx-3 flex flex-row flex-wrap items-center justify-between p-3 hover:bg-gray-75">
								<span className="block text-lg font-medium text-gray-800">
									{capitalizeFirstLetter(role.name.toLowerCase())}{' '}
									<span className="text-base font-normal text-gray-500">
										{role.defaultRole && '(Default)'}
									</span>
								</span>

								<Tooltip side={'top'} message={`Click to view the ${role.name} role`}>
									<div className="-m-2 flex items-center justify-center p-2">
										<FontAwesomeIcon
											fill="currentColor"
											size="1x"
											className="h-5 w-5 text-gray-400"
											icon={faChevronRight}
										/>
									</div>
								</Tooltip>
							</div>
						</div>
					</a>
				</Link>
			))}
		</div>
	);
};
