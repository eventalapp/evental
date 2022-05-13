import { NextkitError } from 'nextkit';
import { api } from '../../../utils/api';
import { EditUserSchema } from '../../../utils/schemas';
import { busboyParseForm } from '../../../utils/busboyParseForm';
import { uploadAndProcessAvatar, uploadAndProcessImage } from '../../../utils/uploadAndProcessImage';
import { prisma } from '../../../prisma/client';

export const config = {
	api: {
		bodyParser: false
	}
};

export default api({
	async PUT({ ctx, req }) {
		const user = await ctx.getUser();

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
