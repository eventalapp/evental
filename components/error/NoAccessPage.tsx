import Head from 'next/head';
import React from 'react';

import { Footer } from '../Footer';
import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import { Navigation } from '../navigation';
import NoAccess from './NoAccess';

type Props = {
	navigation?: React.ReactNode;
};

export const NoAccessPage: React.FC<Props> = (props) => {
	const { navigation = <Navigation /> } = props;

	return (
		<PageWrapper>
			<Head>
				<title>No Access</title>
			</Head>

			{navigation}

			<Column variant="halfWidth" className="flex flex-col items-center justify-center">
				<NoAccess />
			</Column>

			<Footer />
		</PageWrapper>
	);
};
