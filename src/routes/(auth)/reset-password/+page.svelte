<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Set new password
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Please enter your new password below.
      </p>
    </div>
    <form class="mt-8 space-y-6" method="POST" use:enhance>
      {#if form?.message}
        <div class="rounded-md bg-{form?.success ? 'green' : 'red'}-50 p-4">
          <div class="text-sm text-{form?.success ? 'green' : 'red'}-700">
            {form.message}
          </div>
        </div>
      {/if}

      <input type="hidden" name="token" value={data.token} />

      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="password" class="sr-only">New password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="New password"
            minlength="8"
          />
        </div>
        <div>
          <label for="confirmPassword" class="sr-only">Confirm new password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Confirm new password"
            minlength="8"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reset password
        </button>
      </div>

      {#if form?.success}
        <div class="text-sm text-center">
          <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            Back to login
          </a>
        </div>
      {/if}
    </form>
  </div>
</div>