import { error, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: locals.user.userId },
    select: {
      name: true,
      avatar: true
    }
  });

  return {
    user: locals.user,
    profile
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      throw error(401, 'Unauthorized');
    }

    const formData = await request.formData();
    const name = formData.get('name')?.toString() || null;
    const avatar = formData.get('avatar')?.toString() || null;

    try {
      await prisma.profile.upsert({
        where: { userId: locals.user.userId },
        update: { name, avatar },
        create: {
          userId: locals.user.userId,
          name,
          avatar
        }
      });

      return { success: true };
    } catch (e) {
      console.error('Profile update error:', e);
      return fail(500, {
        message: 'Could not update profile'
      });
    }
  }
};