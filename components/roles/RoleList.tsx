import Link from 'next/link';
import React from 'react';
import { capitalizeFirstLetter } from '../../utils/string';
import { UseRolesQueryData } from '../../hooks/queries/useRolesQuery';
import { NotFound } from '../error/NotFound';
import classNames from 'classnames';

type Props = {
	eid: string;
} & UseRolesQueryData;

export const RoleList: React.FC<Props> = (props) => {
	const { eid, roles } = props;

	if (roles && roles.length === 0) {
		return <NotFound message="No roles found." />;
	}

	if (!roles) return null;

	return (
		<div>
			{roles.map((role, i) => (
				<Link href={`/events/${eid}/roles/${role.slug}`} key={role.id} passHref>
					<a>
						<div
							className={classNames(
								'p-3 py-4 border-gray-200',
								i !== roles.length - 1 && 'border-b '
							)}
						>
							<div className="flex flex-row justify-between items-center flex-wrap">
								<span className="text-lg block font-medium">
									{capitalizeFirstLetter(role.name.toLowerCase())}{' '}
									<span className="text-gray-500 font-normal">
										{role.defaultRole && '(Default)'}
									</span>
								</span>
							</div>
						</div>
					</a>
				</Link>
			))}
		</div>
	);
};
