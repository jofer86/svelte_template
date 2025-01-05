import { validatePasswordResetToken, resetPassword, ensureGuest } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
  ensureGuest(locals);

  const token = url.searchParams.get('token');
  if (!token) {
    throw redirect(302, '/forgot-password');
  }

  const passwordReset = await validatePasswordResetToken(token);
  if (!passwordReset) {
    throw redirect(302, '/forgot-password');
  }

  return {
    user: null,
    token
  };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const token = formData.get('token');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (
      typeof token !== 'string' ||
      typeof password !== 'string' ||
      typeof confirmPassword !== 'string' ||
      !token ||
      !password ||
      !confirmPassword
    ) {
      return fail(400, {
        message: 'Invalid request'
      });
    }

    if (password !== confirmPassword) {
      return fail(400, {
        message: 'Passwords do not match'
      });
    }

    if (password.length < 8) {
      return fail(400, {
        message: 'Password must be at least 8 characters long'
      });
    }

    try {
      const success = await resetPassword(token, password);
      if (!success) {
        return fail(400, {
          message: 'Invalid or expired reset token'
        });
      }

      return {
        success: true,
        message: 'Password has been reset successfully'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return fail(500, {
        message: 'An error occurred while resetting your password'
      });
    }
  }
};