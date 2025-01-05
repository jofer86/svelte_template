<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="min-h-screen bg-gray-100">
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <h1 class="text-xl font-semibold">Dashboard</h1>
        </div>
        <div class="flex items-center">
          <span class="text-gray-700 mr-4">Welcome, {data.user?.email}</span>
          <form action="/logout" method="POST">
            <button
              type="submit"
              class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  </nav>

  <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
        <h2 class="text-2xl font-bold mb-4">Welcome to your dashboard!</h2>
        <p class="text-gray-600">
          This is a protected route. You can only see this if you're logged in.
        </p>
      </div>
    </div>
  </main>
</div>