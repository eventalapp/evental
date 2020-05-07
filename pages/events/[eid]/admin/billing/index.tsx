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
					</div>
				</div>

				<p>
					Note: The maximum length of an event is 1 month. The maximum event size you can purchase
					is for 5,000 attendees. If you are hosting longer, larger or multiple events, or need help
					choosing a plan, Contact us →
				</p>
			</Column>
		</PageWrapper>
	);
};

export default EventBillingPage;
