import { NextkitError } from 'nextkit';

import { prisma } from '../../../../prisma/client';
import { api } from '../../../../utils/api';
import { PasswordlessUser, stripUserPassword } from '../../../../utils/stripUserPassword';

export default api({
	async GET({ req }) {
		const { uid } = req.query;

		const user = await getUser(String(uid));

		if (!user) {
			throw new NextkitError(404, 'User not found.');
		}

		return user;
	}
});

export const getUser = async (uid: string): Promise<PasswordlessUser | null> => {
	const user = await prisma.user.findFirst({
		where: { OR: [{ id: String(uid) }, { slug: String(uid) }] }
	});

	if (!user) {
		return null;
	}

	return stripUserPassword(user);
};
