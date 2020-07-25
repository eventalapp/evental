import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { UserSettingsSchema } from '@eventalapp/shared/utils';

import { api } from '../../../utils/api';
import { busboyParseForm } from '../../../utils/form';
import { uploadAndProcessAvatar } from '../../../utils/image';

export const config = {
	api: {
		bodyParser: false
	}
};

export default api({
	async GET({ ctx }) {
		return await ctx.getSelfFullUser();
	},
	async PUT({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		const { buffer, mimeType, formData } = await busboyParseForm(req).catch((err) => {
			throw new NextkitError(500, err.message);
		});

		const body = UserSettingsSchema.parse(formData);

		let fileLocation = await uploadAndProcessAvatar(buffer, mimeType);

		if (!fileLocation && buffer.length >= 1) {
			throw new NextkitError(500, 'Image failed to upload.');
		}

		return await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				...body,
				image: fileLocation
			}
		});
	}
});
