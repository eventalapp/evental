import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';
import { useAttendeesQuery } from '../../../../hooks/useAttendeesQuery';

const AttendeesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { attendees, isAttendeesLoading } = useAttendeesQuery(String(eid));

	return (
		<>
			<Head>
				<title>All Attendees</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<h1 className="text-3xl">Attendees Page</h1>

				{isAttendeesLoading ? (
					<p>Loading...</p>
				) : (
					attendees && (
						<div>
							<div>
								<h2 className="text-2xl my-3">Organizers ({attendees.organizers.length})</h2>
								<ul>
									{attendees.organizers.map((eventMember) => (
										<li key={eventMember.id} className="inline-block">
											<Link href={`/events/${eid}/attendees/${eventMember.userId}`}>
												<a>
													<div className="flex flex-col items-center">
														<div className="h-32 w-32 relative">
															<Image
																alt={String(eventMember.user.name)}
																src={String(eventMember.user.image)}
																className="rounded-full"
																layout="fill"
															/>
														</div>
														<span className="text-lg">{eventMember.user.name}</span>
														<span className="text-md text-gray-700">
															{eventMember.user.company}
														</span>
														<span className="text-md text-gray-700">
															{eventMember.user.position}
														</span>
													</div>
												</a>
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div>
								<h2 className="text-2xl my-3">Attendees ({attendees.attendees.length})</h2>
								<ul>
									{attendees.attendees.map((eventMember) => (
										<li key={eventMember.id}>
											<Link href={`/events/${eid}/attendees/${eventMember.userId}`}>
												<a>
													<div className="h-16 w-16 relative">
														<Image
															alt={String(eventMember.user.name)}
															src={String(eventMember.user.image)}
															className="rounded-full"
															layout="fill"
														/>
													</div>
													<span>{eventMember.user.name}</span>
												</a>
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
					)
				)}
			</Column>
		</>
	);
};

export default AttendeesPage;
