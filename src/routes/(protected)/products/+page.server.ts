import { error, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const products = await prisma.product.findMany({
    where: { ownerId: locals.user.userId },
    orderBy: { createdAt: 'desc' }
  });

  return {
    user: locals.user,
    products
  };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    if (!locals.user) {
      throw error(401, 'Unauthorized');
    }

    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    const sku = formData.get('sku')?.toString();
    const price = formData.get('price')?.toString();

    if (!name || !sku || !price) {
      return fail(400, {
        message: 'All fields are required'
      });
    }

    const priceFloat = parseFloat(price);
    if (isNaN(priceFloat)) {
      return fail(400, {
        message: 'Invalid price'
      });
    }

    try {
      await prisma.product.create({
        data: {
          name,
          sku,
          price: priceFloat,
          ownerId: locals.user.userId
        }
      });

      return { success: true };
    } catch (e) {
      console.error('Product creation error:', e);
      return fail(500, {
        message: 'Could not create product'
      });
    }
  },

  delete: async ({ request, locals }) => {
    if (!locals.user) {
      throw error(401, 'Unauthorized');
    }

    const formData = await request.formData();
    const id = formData.get('id')?.toString();

    if (!id) {
      return fail(400, {
        message: 'Product ID is required'
      });
    }

    try {
      const product = await prisma.product.findUnique({
        where: { id }
      });

      if (!product) {
        return fail(404, {
          message: 'Product not found'
        });
      }

      if (product.ownerId !== locals.user.userId) {
        throw error(403, 'Forbidden');
      }

      await prisma.product.delete({
        where: { id }
      });

      return { success: true };
    } catch (e) {
      console.error('Product deletion error:', e);
      return fail(500, {
        message: 'Could not delete product'
      });
    }
  }
};