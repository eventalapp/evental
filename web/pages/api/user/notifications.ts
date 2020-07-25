import { NextkitError } from 'nextkit';

import { NotificationPreferenceSchema } from '@eventalapp/shared/utils';

import { api } from '../../../utils/api';

export default api({
	async GET({ ctx }) {
		const user = await ctx.getSelfFullUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		const notificationPreferences = await ctx.prisma.notificationPreference.findFirst({
			where: {
				userId: user.id
			}
		});

		if (!notificationPreferences) {
			return await ctx.prisma.notificationPreference.create({
				data: {
					userId: user.id,
					event: true,
					news: true,
					marketing: true
				}
			});
		}

		return notificationPreferences;
	},
	async PUT({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		const body = NotificationPreferenceSchema.parse(req.body);

		let notificationPreferences = await ctx.prisma.notificationPreference.findFirst({
			where: {
				userId: user.id
			}
		});

		if (!notificationPreferences) {
			notificationPreferences = await ctx.prisma.notificationPreference.create({
				data: {
					userId: user.id,
					event: true,
					news: true,
					marketing: true
				}
			});
		}

		const updatedPreferences = await ctx.prisma.notificationPreference.update({
			where: {
				id: notificationPreferences.id
			},
			data: {
				...body
			}
		});

		if (!updatedPreferences) {
			throw new NextkitError(500, 'Could not update preferences.');
		}

		return updatedPreferences;
	}
});
