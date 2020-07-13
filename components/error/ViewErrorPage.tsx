import Head from 'next/head';
import { ErroredAPIResponse } from 'nextkit';
import React from 'react';

import { AdminSidebarWrapper } from '../layout/AdminSidebarWrapper';
import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import { Navigation } from '../navigation';
import { Heading } from '../primitives/Heading';

type Props = {
	errors: Array<ErroredAPIResponse | null | undefined>;
	admin?: boolean;
	eid?: string;
};

export const ViewErrorPage: React.FC<Props> = (props) => {
	const { errors, admin = false, eid } = props;

	if (!errors) {
		return null;
	}

	if (admin && eid) {
		return (
			<PageWrapper>
				<Head>
					<title>Not Found</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading className="mb-3">Error</Heading>

						<ul>
							{errors
								.filter((error) => error)
								.map((error, i) => (
									<li key={i} className="text-gray-600">
										{error!.message}
									</li>
								))}
						</ul>
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<Head>
				<title>Not Found</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<Heading className="mb-3">Error</Heading>

				<ul>
					{errors
						.filter((error) => error)
						.map((error, i) => (
							<li key={i} className="text-gray-600">
								{error!.message}
							</li>
						))}
				</ul>
			</Column>
		</PageWrapper>
	);
};
