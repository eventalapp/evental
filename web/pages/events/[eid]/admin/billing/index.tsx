import { Elements } from '@stripe/react-stripe-js';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { useEvent } from '@eventalapp/shared/hooks';

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
import { getStripe } from '../../../../../utils/stripe';

const EventBillingPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const {
		data: event,
		error: eventError,
		isLoading: isEventLoading
	} = useEvent({ eid: String(eid) });

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
							<Paragraph className="mb-3 text-gray-600">
								View pricing for single event plans for standard and nonprofit or educational
								events.
							</Paragraph>

							{event?.level === 'TRIAL' ? (
								<PurchaseProPlan eid={String(eid)} />
							) : (
								<>
									<div className="mb-3 flex flex-row items-center justify-start">
										<Paragraph className="text-gray-800">Your current plan is</Paragraph>

										<div className="ml-2 flex flex-row items-center">
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
							<div className="mb-5 flex flex-col items-center justify-center">
								<EventalPro />

								<Paragraph className="text-gray-600">Perks and features</Paragraph>
							</div>

							<FeatureList />
						</Column>

						<Column variant="noMargin">
							<div className="mb-5 flex flex-col items-center justify-center">
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
