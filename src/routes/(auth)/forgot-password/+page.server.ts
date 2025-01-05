import { createPasswordResetToken, ensureGuest } from '$lib/server/auth';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { SITE_URL } from '$lib/config';

export const load: PageServerLoad = async ({ locals }) => {
  ensureGuest(locals);
  return {
    user: null
  };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email');

    if (typeof email !== 'string' || !email) {
      return fail(400, {
        message: 'Please enter a valid email address'
      });
    }

    try {
      const result = await createPasswordResetToken(email);
      if (!result) {
        // Don't reveal if email exists
        return {
          success: true,
          message: 'If an account exists with this email, you will receive a password reset link'
        };
      }

      // TODO: Send email with reset link
      const resetLink = `${SITE_URL}/reset-password?token=${result.token}`;
      console.log('Password reset link:', resetLink);

      return {
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return fail(500, {
        message: 'An error occurred while processing your request'
      });
    }
  }
};