import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import React from 'react';

import { UsePagesQueryData } from '../../hooks/queries/usePagesQuery';
import { NotFound } from '../error/NotFound';
import Tooltip from '../radix/components/Tooltip';

type Props = {
	eid: string;
	admin?: boolean;
} & UsePagesQueryData;

export const PageList: React.FC<Props> = (props) => {
	const { eid, pages, admin = false } = props;

	if (pages && pages.length === 0) {
		return <NotFound message="No pages found." />;
	}

	if (!pages) return null;

	return (
		<div>
			{pages.map((page, i) => (
				<Link
					href={`/events/${eid}${admin ? '/admin' : ''}/pages/${page.slug}`}
					key={page.id}
					passHref
				>
					<a>
						<div className={classNames('border-gray-200', i !== pages.length - 1 && 'border-b')}>
							<div className="-mx-3 flex flex-row flex-wrap items-center justify-between rounded-md p-3 hover:bg-gray-75">
								<div>
									<span className="block text-lg">{page.name}</span>{' '}
									<span className="block text-sm text-gray-600">
										Updated{' '}
										{formatDistance(new Date(page.updatedAt), new Date(), { addSuffix: true })}
									</span>
								</div>

								<Tooltip side={'top'} message={`Click to view the ${page.name} page`}>
									<div className="-m-2 flex items-center justify-center p-2">
										<FontAwesomeIcon
											fill="currentColor"
											size="1x"
											className="h-5 w-5 text-gray-500"
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
