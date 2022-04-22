import type Prisma from '@prisma/client';

interface Props {
	loading: boolean;
	role: Prisma.EventRole | undefined;
}

export const ViewRole: React.FC<Props> = (props) => {
	const { loading, role } = props;

	if (loading) {
		return (
			<div>
				<p>Roles loading...</p>
			</div>
		);
	}

	return (
		<div>
			{loading ? (
				<p>Loading Venue...</p>
			) : (
				role && (
					<div>
						<h1 className="text-3xl">{role.role}</h1>
					</div>
				)
			)}
		</div>
	);
};
