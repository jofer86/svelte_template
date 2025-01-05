import { validateUser, createSession, ensureGuest } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  ensureGuest(locals);
  return {
    user: null
  };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email ||
      !password
    ) {
      return fail(400, {
        message: 'Invalid email or password'
      });
    }

    try {
      const user = await validateUser(email, password);
      if (!user) {
        return fail(400, {
          message: 'Invalid email or password'
        });
      }

      await createSession(user.id, cookies);
    } catch (error) {
      console.error('Login error:', error);
      return fail(500, {
        message: 'An error occurred during login'
      });
    }

    throw redirect(302, '/dashboard');
  }
};