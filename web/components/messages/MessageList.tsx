import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Prisma from '@prisma/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';

import { NotFound } from '../error/NotFound';
import Tooltip from '../primitives/Tooltip';

type Props = {
	eid: string;
	admin?: boolean;
	messages: Prisma.EventMessage[];
};

export const MessageList: React.FC<Props> = (props) => {
	const { eid, messages, admin = false } = props;

	if (messages && messages.length === 0) {
		return <NotFound message="No messages found." />;
	}

	if (!messages) return null;

	return (
		<div>
			{messages.map((message, i) => (
				<Link
					href={`/events/${eid}${admin ? '/admin' : ''}/messages/${message.slug}`}
					key={message.id}
					passHref
				>
					<a>
						<div className={classNames('border-gray-200', i !== messages.length - 1 && 'border-b')}>
							<div className="-mx-3 flex flex-row flex-wrap items-center justify-between p-3 hover:bg-gray-75">
								<div>
									<span className="block text-lg font-medium text-gray-800">{message.title}</span>
									<span className="mt-0.5 block text-sm text-gray-500">
										Sent {dayjs(message.createdAt).fromNow()}
										{admin && message.recipientCount
											? ` to ${message.recipientCount} recipients`
											: ''}
									</span>
								</div>

								<Tooltip side={'top'} message={`Click to view this message`}>
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
