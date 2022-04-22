import { EventMemberUser } from '../../pages/api/events/[eid]/attendees/[aid]';

interface Props {
	loading: boolean;
	attendee: EventMemberUser | undefined;
}

export const ViewAttendee: React.FC<Props> = (props) => {
	const { loading, attendee } = props;

	if (loading) {
		return (
			<div>
				<p>Activities loading...</p>
			</div>
		);
	}

	return (
		<div>
			{attendee && (
				<div>
					<img alt={String(attendee.user.name)} src={String(attendee.user.image)} />
					<h1 className="text-3xl">{attendee.user.name}</h1>
					<p>{attendee.permissionRole}</p>
					<span className="text-md text-gray-700 block">{attendee.user.company}</span>
					<span className="text-md text-gray-700 block">{attendee.user.position}</span>
				</div>
			)}
		</div>
	);
};
