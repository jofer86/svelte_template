import { error, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const [inventory, warehouses, products] = await Promise.all([
    prisma.inventory.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        warehouse: true,
        product: true
      }
    }),
    prisma.warehouse.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.product.findMany({
      where: { ownerId: locals.user.userId },
      orderBy: { name: 'asc' }
    })
  ]);

  return {
    user: locals.user,
    inventory,
    warehouses,
    products
  };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    if (!locals.user) {
      throw error(401, 'Unauthorized');
    }

    const formData = await request.formData();
    const warehouseId = formData.get('warehouseId')?.toString();
    const productId = formData.get('productId')?.toString();
    const quantity = formData.get('quantity')?.toString();

    if (!warehouseId || !productId || !quantity) {
      return fail(400, {
        message: 'All fields are required'
      });
    }

    const quantityInt = parseInt(quantity);
    if (isNaN(quantityInt) || quantityInt < 0) {
      return fail(400, {
        message: 'Quantity must be a non-negative number'
      });
    }

    try {
      // Check warehouse capacity
      const warehouse = await prisma.warehouse.findUnique({
        where: { id: warehouseId },
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

      const currentTotal = await prisma.inventory.aggregate({
        where: { warehouseId },
        _sum: { quantity: true }
      });

      const totalAfterAdd = (currentTotal._sum.quantity || 0) + quantityInt;
      if (totalAfterAdd > warehouse.capacity) {
        return fail(400, {
          message: 'Adding this quantity would exceed warehouse capacity'
        });
      }

      // Check if product exists and belongs to user
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product || product.ownerId !== locals.user.userId) {
        return fail(403, {
          message: 'Product not found or access denied'
        });
      }

      // Create or update inventory
      await prisma.inventory.upsert({
        where: {
          warehouseId_productId: {
            warehouseId,
            productId
          }
        },
        create: {
          warehouseId,
          productId,
          quantity: quantityInt
        },
        update: {
          quantity: quantityInt
        }
      });

      return { success: true };
    } catch (e) {
      console.error('Inventory creation error:', e);
      return fail(500, {
        message: 'Could not update inventory'
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
        message: 'Inventory ID is required'
      });
    }

    try {
      const inventory = await prisma.inventory.findUnique({
        where: { id },
        include: {
          product: true
        }
      });

      if (!inventory || inventory.product.ownerId !== locals.user.userId) {
        return fail(403, {
          message: 'Inventory not found or access denied'
        });
      }

      await prisma.inventory.delete({
        where: { id }
      });

      return { success: true };
    } catch (e) {
      console.error('Inventory deletion error:', e);
      return fail(500, {
        message: 'Could not delete inventory'
      });
    }
  },

  update: async ({ request, locals }) => {
    if (!locals.user) {
      throw error(401, 'Unauthorized');
    }

    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    const quantity = formData.get('quantity')?.toString();

    if (!id || !quantity) {
      return fail(400, {
        message: 'All fields are required'
      });
    }

    const quantityInt = parseInt(quantity);
    if (isNaN(quantityInt) || quantityInt < 0) {
      return fail(400, {
        message: 'Quantity must be a non-negative number'
      });
    }

    try {
      const inventory = await prisma.inventory.findUnique({
        where: { id },
        include: {
          product: true,
          warehouse: {
            include: {
              _count: {
                select: { inventory: true }
              }
            }
          }
        }
      });

      if (!inventory || inventory.product.ownerId !== locals.user.userId) {
        return fail(403, {
          message: 'Inventory not found or access denied'
        });
      }

      const currentTotal = await prisma.inventory.aggregate({
        where: {
          warehouseId: inventory.warehouseId,
          NOT: { id: inventory.id }
        },
        _sum: { quantity: true }
      });

      const totalAfterUpdate = (currentTotal._sum.quantity || 0) + quantityInt;
      if (totalAfterUpdate > inventory.warehouse.capacity) {
        return fail(400, {
          message: 'Updating to this quantity would exceed warehouse capacity'
        });
      }

      await prisma.inventory.update({
        where: { id },
        data: {
          quantity: quantityInt
        }
      });

      return { success: true };
    } catch (e) {
      console.error('Inventory update error:', e);
      return fail(500, {
        message: 'Could not update inventory'
      });
    }
  }
};