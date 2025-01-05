<script lang="ts">
  import { enhance } from '$app/forms';
  import Navigation from '$lib/components/Navigation.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  export let form: any;

  let showAddForm = false;
  let editingWarehouse: any = null;

  function startEdit(warehouse: any) {
    editingWarehouse = { ...warehouse };
  }

  function cancelEdit() {
    editingWarehouse = null;
  }
</script>

<Navigation user={data.user} />

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Warehouses</h1>
        <button
          on:click={() => (showAddForm = !showAddForm)}
          class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showAddForm ? 'Cancel' : 'Add Warehouse'}
        </button>
      </div>

      {#if showAddForm}
        <div class="bg-white shadow sm:rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Add New Warehouse</h3>
            <form method="POST" action="?/create" use:enhance class="mt-5 space-y-4">
              {#if form?.message}
                <div class="rounded-md bg-red-50 p-4">
                  <div class="text-sm text-red-700">
                    {form.message}
                  </div>
                </div>
              {/if}

              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  class="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  class="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label for="capacity" class="block text-sm font-medium text-gray-700">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  id="capacity"
                  required
                  min="1"
                  class="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Warehouse
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
                Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Capacity
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Items
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each data.warehouses as warehouse}
              <tr>
                {#if editingWarehouse?.id === warehouse.id}
                  <td colspan="5" class="px-6 py-4">
                    <form method="POST" action="?/update" use:enhance class="space-y-4">
                      <input type="hidden" name="id" value={warehouse.id} />

                      <div class="grid grid-cols-3 gap-4">
                        <div>
                          <label for="edit-name" class="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            name="name"
                            id="edit-name"
                            required
                            bind:value={editingWarehouse.name}
                            class="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label for="edit-location" class="block text-sm font-medium text-gray-700">Location</label>
                          <input
                            type="text"
                            name="location"
                            id="edit-location"
                            required
                            bind:value={editingWarehouse.location}
                            class="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label for="edit-capacity" class="block text-sm font-medium text-gray-700">Capacity</label>
                          <input
                            type="number"
                            name="capacity"
                            id="edit-capacity"
                            required
                            min="1"
                            bind:value={editingWarehouse.capacity}
                            class="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div class="flex justify-end space-x-3">
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
                    {warehouse.name}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {warehouse.location}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {warehouse.capacity}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {warehouse._count.inventory} / {warehouse.capacity}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button
                      on:click={() => startEdit(warehouse)}
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <form method="POST" action="?/delete" use:enhance class="inline">
                      <input type="hidden" name="id" value={warehouse.id} />
                      <button
                        type="submit"
                        class="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </form>
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