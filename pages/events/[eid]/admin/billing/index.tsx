import { Elements } from '@stripe/react-stripe-js';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { EventalPro } from '../../../../../components/billing/EventalPro';
import { FaqAccordion } from '../../../../../components/billing/FaqAccordion';
import { FeatureList } from '../../../../../components/billing/FeatureList';
import { PurchaseProPlan } from '../../../../../components/billing/PurchaseProForm';
import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../components/primitives/Heading';
import { Paragraph } from '../../../../../components/primitives/Paragraph';
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
					<AdminSidebarWrapper eid={String(eid)}>
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
								<>
									<div className="flex flex-row items-center justify-start mb-3">
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
									<Paragraph className="text-gray-600">
										If you have any issues or questions, please{' '}
										<Link href="/contact">
											<a className="underline">Contact Us</a>
										</Link>
										.
									</Paragraph>
								</>
							)}
						</Column>
						<Column variant="noMargin">
							<div className="flex justify-center items-center flex-col mb-5">
								<EventalPro />

								<Paragraph className="text-gray-600">Perks and features</Paragraph>
							</div>

							<FeatureList />
						</Column>

						<Column variant="noMargin">
							<div className="flex justify-center items-center flex-col mb-5">
								<Heading level={3} className="mb-3">
									Frequently Asked Questions
								</Heading>

								<Paragraph className="text-gray-600">
									Still have questions?{' '}
									<Link href="/contact">
										<a className="underline">Contact Us</a>
									</Link>
								</Paragraph>
							</div>

							<FaqAccordion />
						</Column>
					</AdminSidebarWrapper>
				</Elements>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EventBillingPage;
