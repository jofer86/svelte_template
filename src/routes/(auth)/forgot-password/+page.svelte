<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Reset your password
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Enter your email address and we'll send you a link to reset your password.
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

      <div>
        <label for="email" class="sr-only">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Email address"
        />
      </div>

      <div>
        <button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Send reset link
        </button>
      </div>

      <div class="text-sm text-center">
        <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
          Back to login
        </a>
      </div>
    </form>
  </div>
</div>