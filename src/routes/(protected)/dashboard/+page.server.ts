import { ensureAuth } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = ensureAuth(locals);
  return {
    user
  };
};