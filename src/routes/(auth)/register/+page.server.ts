import { createUser, createSession, ensureGuest } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
      const user = await createUser(email, password);
      await createSession(user.id, cookies);
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        return fail(400, {
          message: 'Email already exists'
        });
      }
      return fail(500, {
        message: 'Could not register user'
      });
    }

    throw redirect(302, '/dashboard');
  }
};