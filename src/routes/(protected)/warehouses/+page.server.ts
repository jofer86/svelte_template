import { error, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const warehouses = await prisma.warehouse.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { inventory: true }
      }
    }
  });

  return {
    user: locals.user,
    warehouses
  };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    if (!locals.user) {
      throw error(401, 'Unauthorized');
    }

    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    const location = formData.get('location')?.toString();
    const capacity = formData.get('capacity')?.toString();

    if (!name || !location || !capacity) {
      return fail(400, {
        message: 'All fields are required'
      });
    }

    const capacityInt = parseInt(capacity);
    if (isNaN(capacityInt) || capacityInt <= 0) {
      return fail(400, {
        message: 'Capacity must be a positive number'
      });
    }

    try {
      await prisma.warehouse.create({
        data: {
          name,
          location,
          capacity: capacityInt
        }
      });

      return { success: true };
    } catch (e) {
      console.error('Warehouse creation error:', e);
      return fail(500, {
        message: 'Could not create warehouse'
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
        message: 'Warehouse ID is required'
      });
    }

    try {
      const warehouse = await prisma.warehouse.findUnique({
        where: { id },
        include: {
          _count: {
            select: { inventory: true }
          }
        }
      });

      if (!warehouse) {
        return fail(404, {
          message: 'Warehouse not found'
        });
      }

      if (warehouse._count.inventory > 0) {
        return fail(400, {
          message: 'Cannot delete warehouse with existing inventory'
        });
      }

      await prisma.warehouse.delete({
        where: { id }
      });

      return { success: true };
    } catch (e) {
      console.error('Warehouse deletion error:', e);
      return fail(500, {
        message: 'Could not delete warehouse'
      });
    }
  },

  update: async ({ request, locals }) => {
    if (!locals.user) {
      throw error(401, 'Unauthorized');
    }

    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    const name = formData.get('name')?.toString();
    const location = formData.get('location')?.toString();
    const capacity = formData.get('capacity')?.toString();

    if (!id || !name || !location || !capacity) {
      return fail(400, {
        message: 'All fields are required'
      });
    }

    const capacityInt = parseInt(capacity);
    if (isNaN(capacityInt) || capacityInt <= 0) {
      return fail(400, {
        message: 'Capacity must be a positive number'
      });
    }

    try {
      const warehouse = await prisma.warehouse.findUnique({
        where: { id },
        include: {
          _count: {
            select: { inventory: true }
          }
        }
      });

      if (!warehouse) {
        return fail(404, {
          message: 'Warehouse not found'
        });
      }

      if (warehouse._count.inventory > capacityInt) {
        return fail(400, {
          message: 'New capacity cannot be less than current inventory'
        });
      }

      await prisma.warehouse.update({
        where: { id },
        data: {
          name,
          location,
          capacity: capacityInt
        }
      });

      return { success: true };
    } catch (e) {
      console.error('Warehouse update error:', e);
      return fail(500, {
        message: 'Could not update warehouse'
      });
    }
  }
};