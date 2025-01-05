<script lang="ts">
  import Navigation from '$lib/components/Navigation.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<Navigation user={data.user} />

<div class="bg-white">
  <div class="relative isolate px-6 pt-14 lg:px-8">
    <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Build your SaaS faster with SvelteKit
        </h1>
        <p class="mt-6 text-lg leading-8 text-gray-600">
          A complete SaaS starter template with authentication, user management, billing, and more.
          Built with SvelteKit, Prisma, and TailwindCSS.
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/register"
            class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get started
          </a>
          <a href="/login" class="text-sm font-semibold leading-6 text-gray-900">
            Sign in <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-gray-50 py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:text-center">
        <h2 class="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Everything you need to build your SaaS
        </p>
        <p class="mt-6 text-lg leading-8 text-gray-600">
          Start with a fully functional SaaS template and focus on building your unique features.
        </p>
      </div>
      <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          <div class="flex flex-col">
            <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
              Authentication
            </dt>
            <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
              <p class="flex-auto">
                Complete authentication system with email and password, session management, and protected routes.
              </p>
            </dd>
          </div>
          <div class="flex flex-col">
            <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
              User Management
            </dt>
            <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
              <p class="flex-auto">
                User profiles, roles, and permissions system built-in. Easily extend with custom fields.
              </p>
            </dd>
          </div>
          <div class="flex flex-col">
            <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
              API Ready
            </dt>
            <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
              <p class="flex-auto">
                RESTful API endpoints with proper error handling, rate limiting, and documentation.
              </p>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</div>
