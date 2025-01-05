<script lang="ts">
  import { page } from '$app/stores';

  export let user: { email: string } | null = null;
</script>

<nav class="bg-white shadow">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">
          <a href="/" class="text-xl font-bold text-indigo-600">SvelteSaaS</a>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          <a
            href="/"
            class="inline-flex items-center px-1 pt-1 {$page.url.pathname === '/'
              ? 'border-b-2 border-indigo-500 text-gray-900'
              : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
          >
            Home
          </a>
          {#if user}
            <a
              href="/dashboard"
              class="inline-flex items-center px-1 pt-1 {$page.url.pathname === '/dashboard'
                ? 'border-b-2 border-indigo-500 text-gray-900'
                : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
            >
              Dashboard
            </a>
            <a
              href="/profile"
              class="inline-flex items-center px-1 pt-1 {$page.url.pathname === '/profile'
                ? 'border-b-2 border-indigo-500 text-gray-900'
                : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
            >
              Profile
            </a>
            <a
              href="/products"
              class="inline-flex items-center px-1 pt-1 {$page.url.pathname === '/products'
                ? 'border-b-2 border-indigo-500 text-gray-900'
                : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
            >
              Products
            </a>
          {/if}
        </div>
      </div>
      <div class="flex items-center">
        {#if user}
          <span class="text-gray-700 mr-4">Welcome, {user.email}</span>
          <form action="/logout" method="POST">
            <button
              type="submit"
              class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </form>
        {:else}
          <a
            href="/login"
            class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            Login
          </a>
          <a
            href="/register"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign up
          </a>
        {/if}
      </div>
    </div>
  </div>
</nav>