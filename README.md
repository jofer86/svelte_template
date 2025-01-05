# SvelteKit SaaS Template

A complete SaaS starter template built with SvelteKit, Prisma, and TailwindCSS.

## Features

- 🔐 Authentication with session management
- 👤 User profiles and management
- 🛡️ Protected routes
- 🚦 API rate limiting
- 📝 Form handling with validation
- 🎨 Tailwind styling
- 🗄️ PostgreSQL database
- 📊 Type-safe database queries with Prisma

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your PostgreSQL database and update `.env`:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Adding New Resources

Here's a guide on how to add new resources to the template, using Products as an example.

### 1. Database Schema

Add your model to `prisma/schema.prisma`:

```prisma
model Product {
  id        String   @id @default(uuid())
  name      String
  sku       String   @unique
  price     Float
  ownerId   String
  owner     User     @relation(fields: [ownerId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([ownerId])
  @@index([sku])
}
```

Update the User model to include the relation:

```prisma
model User {
  // ... existing fields
  products Product[]
}
```

Apply the changes:
```bash
npx prisma migrate dev --name add_products
```

### 2. Create Resource Routes

Create the following files:

`src/routes/(protected)/products/+page.svelte`:
```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import Navigation from '$lib/components/Navigation.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  export let form: any;

  let showAddForm = false;
</script>

<Navigation user={data.user} />

<!-- List View -->
<div class="bg-white shadow overflow-hidden sm:rounded-lg">
  <table class="min-w-full divide-y divide-gray-200">
    <thead>
      <tr>
        <th>Name</th>
        <th>SKU</th>
        <th>Price</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each data.products as product}
        <tr>
          <td>{product.name}</td>
          <td>{product.sku}</td>
          <td>${product.price}</td>
          <td>
            <form method="POST" action="?/delete">
              <input type="hidden" name="id" value={product.id} />
              <button type="submit">Delete</button>
            </form>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- Add Form -->
{#if showAddForm}
  <form method="POST" action="?/create" use:enhance>
    <input name="name" required />
    <input name="sku" required />
    <input name="price" type="number" step="0.01" required />
    <button type="submit">Add Product</button>
  </form>
{/if}
```

`src/routes/(protected)/products/+page.server.ts`:
```typescript
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

    try {
      await prisma.product.create({
        data: {
          name,
          sku,
          price: parseFloat(price),
          ownerId: locals.user.userId
        }
      });
      return { success: true };
    } catch (e) {
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

      if (!product || product.ownerId !== locals.user.userId) {
        throw error(403, 'Forbidden');
      }

      await prisma.product.delete({ where: { id } });
      return { success: true };
    } catch (e) {
      return fail(500, {
        message: 'Could not delete product'
      });
    }
  }
};
```

### 3. Add Navigation Link

Update `src/lib/components/Navigation.svelte` to include the new route:

```svelte
{#if user}
  <a
    href="/products"
    class="inline-flex items-center px-1 pt-1 {$page.url.pathname === '/products'
      ? 'border-b-2 border-indigo-500 text-gray-900'
      : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
  >
    Products
  </a>
{/if}
```

### 4. Add API Documentation (Optional)

If your resource has API endpoints, add them to `src/routes/api/docs/+page.svelte`:

```svelte
<h4>Product Management</h4>
<div class="space-y-4">
  <div class="border rounded-md p-4">
    <h5>GET /api/products</h5>
    <p>Retrieve user's products</p>
    <pre>
      Response: Product[]
    </pre>
  </div>
</div>
```

## Resource Implementation Checklist

When adding a new resource, follow these steps:

1. [ ] Add Prisma model with proper relations
2. [ ] Create database migration
3. [ ] Add protected routes for the resource
4. [ ] Implement server-side load function
5. [ ] Implement form actions (create, update, delete)
6. [ ] Add client-side form with validation
7. [ ] Add navigation link
8. [ ] Update API documentation
9. [ ] Add error handling
10. [ ] Test all CRUD operations

## License

MIT
