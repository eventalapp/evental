import type Prisma from '@prisma/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
	loading: boolean;
	events: Prisma.Event[] | undefined;
}

export const EventList: React.FC<Props> = (props) => {
	const { loading, events } = props;

	if (loading) {
		return (
			<div>
				<p>Events loading...</p>
			</div>
		);
	}

	if (events?.length === 0) {
		return (
			<div>
				<p>No events found.</p>
			</div>
		);
	}

	return (
		<div>
			{events &&
				events.map((event, i) => (
					<div
						key={event.id}
						className={classNames(
							'hover:bg-gray-100 border-gray-200',
							i + 1 !== events.length ? 'border-b-2' : null
						)}
					>
						<Link href={`/events/${event.id}`}>
							<a className="px-3 py-3 block">
								<div className="flex flex-row items-center">
									<div className="flex flex-col align-center justify-center mr-5">
										<span className="text-gray-800 text-center inline">
											{dayjs(event.startDate).format('MMM DD')}
											<br />
											{dayjs(event.endDate).format('MMM DD')}
										</span>
									</div>

									<div className="mr-5 relative w-14 h-14 rounded-md">
										{event.image ? (
											<Image
												alt={event.name}
												src={String(event.image)}
												layout="fill"
												className="rounded-md"
											/>
										) : (
											<div className="bg-yellow-400 rounded-md h-full"></div>
										)}
									</div>

									<div className="flex flex-col justify-between">
										<span className="text-gray-600 text-sm block">{event.type}</span>
										<span className="text-xl mr-3">{event.name}</span>
									</div>
								</div>
							</a>
						</Link>
					</div>
				))}
		</div>
	);
};
