import Head from 'next/head';
import React from 'react';

import Column from '../layout/Column';
import { Footer } from '../layout/Footer';
import PageWrapper from '../layout/PageWrapper';
import { Navigation } from '../navigation';
import NoAccess from './NoAccess';

type Props = {
	navigation?: React.ReactNode;
	message?: string;
};

export const NoAccessPage: React.FC<Props> = (props) => {
	const { navigation = <Navigation />, message } = props;

	return (
		<PageWrapper>
			<Head>
				<title>No Access</title>
			</Head>

			{navigation}

			<Column variant="halfWidth" className="flex flex-col items-center justify-center">
				<NoAccess message={message} />
			</Column>

			<Footer />
		</PageWrapper>
	);
};
