import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { LinkButton } from '../components/form/LinkButton';
import Column from '../components/layout/Column';
import { Navigation } from '../components/navigation';
import { faCalendarPlus, faListUl } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const HomePage: NextPage = () => {
	return (
		<>
			<Head>
				<title>Evental</title>
			</Head>

			<Navigation />

			<Column className="flex flex-col items-center">
				<h1 className="px-2 mb-3 text-4xl sm:text-5xl font-black leading-tight text-center lg:text-6xl tracking-tight">
					Host Outstanding Events
				</h1>
				<p className="max-w-4xl mt-1 mb-6 text-center text-md text-md lg:text-xl leading-2 lg:leading-8 text-gray-600">
					Event management software that's highly intuitive. Your attendees and organizers will love
					using Evental for your in-person, hybrid, and virtual events.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					<Link href="/events/create" passHref>
						<LinkButton variant="primary" padding="large">
							Host An Event
							<FontAwesomeIcon
								fill="currentColor"
								className="ml-1.5"
								size="1x"
								icon={faCalendarPlus}
							/>
						</LinkButton>
					</Link>
					<Link href="/events" passHref>
						<LinkButton variant="inversePrimary" padding="large">
							View All Events
							<FontAwesomeIcon fill="currentColor" className="ml-1.5" size="1x" icon={faListUl} />
						</LinkButton>
					</Link>
				</div>
			</Column>
		</>
	);
};

export default HomePage;
