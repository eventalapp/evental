import { NextkitError } from 'nextkit';

import { prisma } from '../../../prisma/client';
import { api } from '../../../utils/api';
import { busboyParseForm } from '../../../utils/form';
import { uploadAndProcessAvatar } from '../../../utils/image';
import { EditUserSchema } from '../../../utils/schemas';

export const config = {
	api: {
		bodyParser: false
	}
};

export default api({
	async PUT({ ctx, req }) {
		const user = await ctx.getStrippedUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		const { buffer, mimeType, formData } = await busboyParseForm(req);

		const body = EditUserSchema.parse(formData);

		let fileLocation = await uploadAndProcessAvatar(buffer, mimeType);

		if (!fileLocation && buffer.length >= 1) {
			throw new NextkitError(500, 'Image failed to upload.');
		}

		await prisma.user.update({
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
