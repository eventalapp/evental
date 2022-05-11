import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import Column from '../../../../../components/layout/Column';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { useFounderQuery } from '../../../../../hooks/queries/useFounderQuery';
import Slider from '../../../../../components/radix/components/Slider';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import { LinkButton } from '../../../../../components/form/LinkButton';
import { attendeesToPrice } from '../../../../../utils/price';

const EventBillingPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { isFounderLoading, isFounder } = useFounderQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	const { control, watch } = useForm({ defaultValues: { attendees: 250 } });

	const attendees = watch('attendees');
	if (isEventLoading || isUserLoading || isFounderLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (!isFounder) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Event Billing</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<h3 className="text-xl md:text-2xl font-medium">Single Event Plans & Pricing</h3>

				<div className="flex flex-col items-center">
					<p className="text-lg font-medium mb-3">How many attendees are you expecting?</p>

					<div className="mb-3">
						<span className="text-xl text-gray-600">
							<strong className="text-2xl md:text-3xl text-gray-900">{attendees}</strong> Attendees
						</span>

						<Controller
							control={control}
							name="attendees"
							render={({ field }) => (
								<Slider
									onChange={(val) => {
										field.onChange(val);
									}}
									value={field.value}
									max={5000}
									min={250}
									step={250}
								/>
							)}
						/>
						{attendees >= 5000 && (
							<p className="text-gray-600">
								More than 5,000 people?{' '}
								<Link href="/contact">
									<a className="text-primary font-medium">Ask us for a same-day quote.</a>
								</Link>
							</p>
						)}

						<p className="text-xl">
							<strong>{attendees}</strong> Attendees
						</p>
					</div>
					<div className="bg-white border-gray-300 border rounded shadow-sm p-5 flex flex-col justify-between items-center space-y-4 max-w-[450px] min-h-[350px]">
						<div className="flex flex-row items-center">
							<strong
								className="text-2xl tracking-tight font-bold font-display mr-2"
								aria-label="evental homepage"
							>
								Evental
							</strong>
							<span className="bg-primary text-white px-2 py-1 font-medium text-xs rounded">
								PRO
							</span>
						</div>

						<p className="text-gray-700">
							The pro plan allows event organizers to create unlimited events, sessions, venues, and
							pages. It also allows you to invite additional organizers to help you manage your
							event.
						</p>

						<div>
							<p className="font-bold text-xl text-center">${attendeesToPrice(attendees)}</p>
							<p className="text-gray-600 text-sm text-center">Includes {attendees} attendees</p>
						</div>

						<Link href={`/payment/checkout`}>
							<LinkButton>Purchase</LinkButton>
						</Link>
						<Link href="/contact">
							<a className="text-sm text-gray-500">
								Need help? <span className="text-gray-800 underline">Contact us</span>
							</a>
						</Link>
					</div>
				</div>
			</Column>
		</PageWrapper>
	);
};

export default EventBillingPage;
