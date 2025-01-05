<script lang="ts">
  import { enhance } from '$app/forms';
  import Navigation from '$lib/components/Navigation.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  let showAddForm = false;
  let editingEmployee: any = null;

  function startEdit(employee: any) {
    editingEmployee = { ...employee };
  }

  function cancelEdit() {
    editingEmployee = null;
  }

  function cancelAdd() {
    showAddForm = false;
  }
</script>

<Navigation user={data.user} />

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Employees</h1>
        <p class="mt-1 text-sm text-gray-600">Manage your employees</p>
      </div>
      {#if !showAddForm}
        <button
          on:click={() => (showAddForm = true)}
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Employee
        </button>
      {/if}
    </div>

    <!-- Add Form -->
    {#if showAddForm}
      <div class="bg-white shadow sm:rounded-lg mb-6 p-4">
        <form method="POST" action="?/create" use:enhance>
          {#if form?.message}
            <div class="rounded-md bg-red-50 p-4 mb-4">
              <div class="text-sm text-red-700">{form.message}</div>
            </div>
          {/if}

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                id="role"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="STAFF">Staff</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                required
                minlength="8"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div class="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              on:click={cancelAdd}
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    {/if}

    <!-- Employee List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each data.employees as employee}
            {#if editingEmployee?.id === employee.id}
              <tr>
                <td colspan="5" class="px-6 py-4">
                  <form method="POST" action="?/update" use:enhance>
                    <input type="hidden" name="id" value={employee.id} />
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label for="firstName" class="block text-sm font-medium text-gray-700"
                          >First Name</label
                        >
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          required
                          value={editingEmployee.firstName}
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label for="lastName" class="block text-sm font-medium text-gray-700"
                          >Last Name</label
                        >
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          required
                          value={editingEmployee.lastName}
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label for="email" class="block text-sm font-medium text-gray-700"
                          >Email</label
                        >
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={editingEmployee.email}
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700"
                          >Phone</label
                        >
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={editingEmployee.phone || ''}
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                        <select
                          name="role"
                          id="role"
                          required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="STAFF" selected={editingEmployee.role === 'STAFF'}>
                            Staff
                          </option>
                          <option value="MANAGER" selected={editingEmployee.role === 'MANAGER'}>
                            Manager
                          </option>
                          <option value="ADMIN" selected={editingEmployee.role === 'ADMIN'}>
                            Admin
                          </option>
                        </select>
                      </div>

                      <div>
                        <label for="password" class="block text-sm font-medium text-gray-700"
                          >New Password (optional)</label
                        >
                        <input
                          type="password"
                          name="password"
                          id="password"
                          minlength="8"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div class="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        on:click={cancelEdit}
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
            {:else}
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{employee.email}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{employee.phone || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {employee.role ===
                    'ADMIN'
                      ? 'bg-purple-100 text-purple-800'
                      : employee.role === 'MANAGER'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'}"
                  >
                    {employee.role}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-3">
                    <button
                      on:click={() => startEdit(employee)}
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <form method="POST" action="?/delete" use:enhance>
                      <input type="hidden" name="id" value={employee.id} />
                      <button type="submit" class="text-red-600 hover:text-red-900">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>