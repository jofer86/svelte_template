<script lang="ts">
  import { enhance } from '$app/forms';
  import Navigation from '$lib/components/Navigation.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  export let form: any;
</script>

<Navigation user={data.user} />

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
          <div class="mt-2 max-w-xl text-sm text-gray-500">
            <p>Update your account profile information and email address.</p>
          </div>
          <form method="POST" use:enhance class="mt-5 space-y-6">
            {#if form?.message}
              <div class="rounded-md bg-red-50 p-4">
                <div class="text-sm text-red-700">
                  {form.message}
                </div>
              </div>
            {/if}

            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <div class="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={data.profile?.name ?? ''}
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label for="avatar" class="block text-sm font-medium text-gray-700">
                Avatar URL
              </label>
              <div class="mt-1">
                <input
                  type="text"
                  name="avatar"
                  id="avatar"
                  value={data.profile?.avatar ?? ''}
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div class="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={data.user?.email ?? ''}
                  disabled
                  class="shadow-sm bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p class="mt-2 text-sm text-gray-500">
                Email address cannot be changed.
              </p>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>