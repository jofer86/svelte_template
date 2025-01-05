<script lang="ts">
  import { enhance } from '$app/forms';
  import Navigation from '$lib/components/Navigation.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  export let form: any;

  let showAddForm = false;
  let editingInventory: any = null;

  function startEdit(inventory: any) {
    editingInventory = { ...inventory };
  }

  function cancelEdit() {
    editingInventory = null;
  }

  $: totalItems = data.inventory.reduce((sum, item) => sum + item.quantity, 0);
</script>

<Navigation user={data.user} />

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          <p class="mt-1 text-sm text-gray-600">Total Items: {totalItems}</p>
        </div>
        <button
          on:click={() => (showAddForm = !showAddForm)}
          class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showAddForm ? 'Cancel' : 'Add Inventory'}
        </button>
      </div>

      {#if showAddForm}
        <div class="bg-white shadow sm:rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Add New Inventory</h3>
            <form method="POST" action="?/create" use:enhance class="mt-5 space-y-4">
              {#if form?.message}
                <div class="rounded-md bg-red-50 p-4">
                  <div class="text-sm text-red-700">
                    {form.message}
                  </div>
                </div>
              {/if}

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label for="warehouseId" class="block text-sm font-medium text-gray-700"
                    >Warehouse</label
                  >
                  <select
                    id="warehouseId"
                    name="warehouseId"
                    required
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a warehouse</option>
                    {#each data.warehouses as warehouse}
                      <option value={warehouse.id}>{warehouse.name}</option>
                    {/each}
                  </select>
                </div>

                <div>
                  <label for="productId" class="block text-sm font-medium text-gray-700">Product</label>
                  <select
                    id="productId"
                    name="productId"
                    required
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a product</option>
                    {#each data.products as product}
                      <option value={product.id}>{product.name} ({product.sku})</option>
                    {/each}
                  </select>
                </div>

                <div>
                  <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    min="0"
                    required
                    class="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="mt-5">
                <button
                  type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      {/if}

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Warehouse
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each data.inventory as inventory}
              <tr>
                {#if editingInventory?.id === inventory.id}
                  <td colspan="4" class="px-6 py-4">
                    <form method="POST" action="?/update" use:enhance class="space-y-4">
                      <input type="hidden" name="id" value={inventory.id} />

                      <div class="grid grid-cols-1 gap-4">
                        <div>
                          <label for="edit-quantity" class="block text-sm font-medium text-gray-700"
                            >Quantity</label
                          >
                          <input
                            type="number"
                            name="quantity"
                            id="edit-quantity"
                            min="0"
                            required
                            bind:value={editingInventory.quantity}
                            class="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div class="flex space-x-3">
                        <button
                          type="button"
                          on:click={cancelEdit}
                          class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </td>
                {:else}
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {inventory.product.name} ({inventory.product.sku})
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inventory.warehouse.name}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inventory.quantity}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-3">
                      <button
                        on:click={() => startEdit(inventory)}
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <form method="POST" action="?/delete" use:enhance class="inline">
                        <input type="hidden" name="id" value={inventory.id} />
                        <button type="submit" class="text-red-600 hover:text-red-900">Delete</button>
                      </form>
                    </div>
                  </td>
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>