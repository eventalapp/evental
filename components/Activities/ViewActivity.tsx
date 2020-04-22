import type Prisma from '@prisma/client';

interface Props {
	loading: boolean;
	activity: Prisma.EventActivity | undefined;
}

export const ViewActivity: React.FC<Props> = (props) => {
	const { loading, activity } = props;

	if (loading) {
		return (
			<div>
				<p>Activities loading...</p>
			</div>
		);
	}

	return (
		<div>
			{activity && (
				<div>
					<h1 className="text-3xl">{activity.name}</h1>
					<p>{activity.description}</p>
					<p>{activity.startDate}</p>
					<p>{activity.endDate}</p>
				</div>
			)}
		</div>
	);
};
