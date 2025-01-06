/* eslint-disable @typescript-eslint/no-explicit-any */
import { error, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import bcrypt from 'bcryptjs';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Ensure user is authenticated and is an admin
  if (!locals.user || locals.user.role !== 'ADMIN') {
    throw error(403, 'Unauthorized');
  }

  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return {
      employees
    };
  } catch (e) {
    console.error('Error loading employees:', e);
    throw error(500, 'Error loading employees');
  }
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    // Ensure user is authenticated and is an admin
    if (!locals.user || locals.user.role !== 'ADMIN') {
      throw error(403, 'Unauthorized');
    }

    const formData = await request.formData();
    const firstName = formData.get('firstName')?.toString();
    const lastName = formData.get('lastName')?.toString();
    const email = formData.get('email')?.toString();
    const phone = formData.get('phone')?.toString();
    const role = formData.get('role')?.toString();
    const password = formData.get('password')?.toString();

    if (!firstName || !lastName || !email || !role || !password) {
      return fail(400, {
        message: 'Missing required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, {
        message: 'Invalid email format'
      });
    }

    // Validate role
    if (!['ADMIN', 'MANAGER', 'STAFF'].includes(role)) {
      return fail(400, {
        message: 'Invalid role'
      });
    }

    try {
      // Check if email is already in use
      const existingEmployee = await prisma.employee.findUnique({
        where: { email }
      });

      if (existingEmployee) {
        return fail(400, {
          message: 'Email already in use'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create employee
      await prisma.employee.create({
        data: {
          firstName,
          lastName,
          email,
          phone: phone || null,
          role: role as 'ADMIN' | 'MANAGER' | 'STAFF',
          hashedPassword
        }
      });

      return {
        success: true
      };
    } catch (e) {
      console.error('Error creating employee:', e);
      return fail(500, {
        message: 'Error creating employee'
      });
    }
  },

  update: async ({ request, locals }) => {
    // Ensure user is authenticated and is an admin
    if (!locals.user || locals.user.role !== 'ADMIN') {
      throw error(403, 'Unauthorized');
    }

    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    const firstName = formData.get('firstName')?.toString();
    const lastName = formData.get('lastName')?.toString();
    const email = formData.get('email')?.toString();
    const phone = formData.get('phone')?.toString();
    const role = formData.get('role')?.toString();
    const password = formData.get('password')?.toString();

    if (!id || !firstName || !lastName || !email || !role) {
      return fail(400, {
        message: 'Missing required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, {
        message: 'Invalid email format'
      });
    }

    // Validate role
    if (!['ADMIN', 'MANAGER', 'STAFF'].includes(role)) {
      return fail(400, {
        message: 'Invalid role'
      });
    }

    try {
      // Check if email is already in use by another employee
      const existingEmployee = await prisma.employee.findFirst({
        where: {
          email,
          NOT: { id }
        }
      });

      if (existingEmployee) {
        return fail(400, {
          message: 'Email already in use'
        });
      }

      // Update employee
      const updateData: any = {
        firstName,
        lastName,
        email,
        phone: phone || null,
        role: role as 'ADMIN' | 'MANAGER' | 'STAFF'
      };

      // Only update password if provided
      if (password) {
        updateData.hashedPassword = await bcrypt.hash(password, 10);
      }

      await prisma.employee.update({
        where: { id },
        data: updateData
      });

      return {
        success: true
      };
    } catch (e) {
      console.error('Error updating employee:', e);
      return fail(500, {
        message: 'Error updating employee'
      });
    }
  },

  delete: async ({ request, locals }) => {
    // Ensure user is authenticated and is an admin
    if (!locals.user || locals.user.role !== 'ADMIN') {
      throw error(403, 'Unauthorized');
    }

    const formData = await request.formData();
    const id = formData.get('id')?.toString();

    if (!id) {
      return fail(400, {
        message: 'Employee ID is required'
      });
    }

    try {
      await prisma.employee.delete({
        where: { id }
      });

      return {
        success: true
      };
    } catch (e) {
      console.error('Error deleting employee:', e);
      return fail(500, {
        message: 'Error deleting employee'
      });
    }
  }
};