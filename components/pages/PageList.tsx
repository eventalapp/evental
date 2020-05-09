import Link from 'next/link';
import React from 'react';
import { UsePagesQueryData } from '../../hooks/queries/usePagesQuery';
import { NotFound } from '../error/NotFound';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { formatDistance } from 'date-fns';

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
						<div
							className={classNames(
								'p-3 py-4 border-gray-200',
								i !== pages.length - 1 && 'border-b-2'
							)}
						>
							<div className="flex flex-row justify-between items-center flex-wrap">
								<div>
									<span className="text-lg block">{page.name}</span>{' '}
									<span className="text-sm block text-gray-600">
										Updated{' '}
										{formatDistance(new Date(page.updatedAt), new Date(), { addSuffix: true })}
									</span>
								</div>

								<FontAwesomeIcon fill="currentColor" size="lg" icon={faChevronRight} />
							</div>
						</div>
					</a>
				</Link>
			))}
		</div>
	);
};
