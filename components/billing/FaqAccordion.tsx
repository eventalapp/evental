import Link from 'next/link';
import React from 'react';

import { Accordion } from '../primitives/Accordion';

export const FaqAccordion = () => {
	return (
		<Accordion
			className="col-span-4 md:col-span-3"
			items={[
				{
					header: 'Do you offer a nonprofit or education plans?',
					content: (
						<p>
							Yes, we offer nonprofit and educational plans. Please{' '}
							<Link href="/contact">
								<a className="underline">Contact Us</a>
							</Link>{' '}
							if you are interested in learning more and accessing this plan.
						</p>
					)
				},

				{
					header: 'Is event setup assistance offered?',
					content: (
						<p>
							Yes, we offer event setup assistance. You can first review our{' '}
							<Link href="/guides">
								<a className="underline">Support Guides</a>
							</Link>
							, if you still need help, please{' '}
							<Link href="/contact">
								<a className="underline">Contact Us</a>
							</Link>
							.
						</p>
					)
				},
				{
					header: 'Do you offer any subscriptions plans?',
					content: (
						<p>
							Yes, we offer several subscription plans for and organizations/individuals who plan to
							hold several events in a year.
						</p>
					)
				},
				{
					header: 'What payment methods do you support?',
					content: (
						<p>
							We accept credit cards, debit cards, checks, wire transfers, ACH, and checks. If you
							are unsure if your payment method is supported. Please{' '}
							<Link href="/contact">
								<a className="underline">Contact Us</a>
							</Link>
							.
						</p>
					)
				},

				{
					header: 'How long of events can I host?',
					content: (
						<p>
							Currently we have a 1 month length limit on events. The event will still be viewable
							after the event end date for attendees, speakers, and organizers to view after the
							event.
						</p>
					)
				},
				{
					header: 'Do you provide quotes?',
					content: (
						<p>
							Yes, we can provide a quote. Please{' '}
							<Link href="/contact">
								<a className="underline">Contact Us</a>
							</Link>{' '}
							to receive a quote.
						</p>
					)
				},
				{
					header: 'How are your plans priced?',
					content: (
						<p>
							Our pricing is based off of the plan level you choose, and the number of attendees you
							are expecting. If you would like to learn more about our pricing, Please{' '}
							<Link href="/contact">
								<a className="underline">Contact Us</a>
							</Link>
							.
						</p>
					)
				},

				{
					header: 'Is there any training/support offered?',
					content: (
						<p>
							Yes, we offer several training and learning opportunities to allow you to easily setup
							and publish your event. Which includes administration, attendee, and speaker guides at
							the{' '}
							<Link href="/guides">
								<a className="underline">Support Guides</a>
							</Link>{' '}
							page.
						</p>
					)
				},
				{
					header: 'Is a free trial offered?',
					content: (
						<p>
							Yes, we offer a{' '}
							<Link href="/events/create">
								<a className="underline">Free Trial</a>
							</Link>{' '}
							so you can create roles, pages, sessions, invite organizers, and customize your event
							before purchasing a premium plan. If you have any questions regarding the free trial,{' '}
							<Link href="/contact">
								<a className="underline">Contact Us</a>
							</Link>
							.
						</p>
					)
				}
			]}
		/>
	);
};
