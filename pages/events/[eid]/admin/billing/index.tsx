import { Elements } from '@stripe/react-stripe-js';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { AdminPageWrapper } from '../../../../../components/AdminPageWrapper';
import { PurchaseProPlan } from '../../../../../components/billing/PurchaseProForm';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../../components/typography/Heading';
import { Paragraph } from '../../../../../components/typography/Paragraph';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { getStripe } from '../../../../../utils/stripe';

const EventBillingPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));

	return (
		<AdminPageWrapper
			eid={String(eid)}
			founderPage
			isLoading={isEventLoading}
			errors={[eventError]}
		>
			<PageWrapper>
				<Elements stripe={getStripe()}>
					<SidebarWrapper eid={String(eid)}>
						<Head>
							<title>Event Billing</title>
						</Head>

						<Column variant="noMargin">
							<Heading className="mb-3">Single Event Plans &amp; Pricing</Heading>
							<Paragraph className="text-gray-600 mb-3">
								View pricing for single event plans for standard and nonprofit or educational
								events.
							</Paragraph>

							{event?.level === 'TRIAL' ? (
								<PurchaseProPlan eid={String(eid)} />
							) : (
								<div className="flex flex-row items-center justify-start">
									<Paragraph className="text-gray-800">Your current plan is</Paragraph>
									<div className="flex flex-row items-center ml-2">
										<strong className="mr-2 font-display text-2xl font-bold tracking-tight">
											Evental
										</strong>
										<span className="rounded bg-primary py-1 px-2 text-xs font-medium text-white">
											PRO
										</span>
									</div>
								</div>
							)}
						</Column>
					</SidebarWrapper>
				</Elements>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EventBillingPage;
