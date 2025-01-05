<script lang="ts">
  import Navigation from '$lib/components/Navigation.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const profileGetResponse = {
    name: 'string | null',
    avatar: 'string | null',
    email: 'string'
  };

  const profilePutRequest = {
    name: 'string?',
    avatar: 'string?'
  };

  const profilePutResponse = {
    name: 'string | null',
    avatar: 'string | null'
  };
</script>

<Navigation user={data.user} />

<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h1 class="text-3xl font-bold leading-tight text-gray-900">API Documentation</h1>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Complete documentation for the SvelteSaaS API endpoints.
        </p>
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div class="prose max-w-none">
          <h2>Authentication</h2>
          <p>All protected endpoints require a valid session cookie.</p>

          <h3>Rate Limiting</h3>
          <p>API requests are limited to 100 requests per minute per IP address.</p>

          <h3>Endpoints</h3>

          <h4>Profile Management</h4>
          <div class="space-y-4">
            <div class="border rounded-md p-4">
              <h5 class="font-semibold">GET /api/profile</h5>
              <p class="text-sm text-gray-600">Retrieve the current user's profile information.</p>
              <pre class="bg-gray-50 p-2 mt-2 rounded text-sm">Response: {JSON.stringify(profileGetResponse, null, 2)}</pre>
            </div>

            <div class="border rounded-md p-4">
              <h5 class="font-semibold">PUT /api/profile</h5>
              <p class="text-sm text-gray-600">Update the current user's profile information.</p>
              <pre class="bg-gray-50 p-2 mt-2 rounded text-sm">
Request: {JSON.stringify(profilePutRequest, null, 2)}

Response: {JSON.stringify(profilePutResponse, null, 2)}</pre>
            </div>
          </div>

          <h4>Error Responses</h4>
          <div class="space-y-2">
            <p><code>400</code> - Bad Request: Invalid input data</p>
            <p><code>401</code> - Unauthorized: Authentication required</p>
            <p><code>403</code> - Forbidden: Insufficient permissions</p>
            <p><code>404</code> - Not Found: Resource doesn't exist</p>
            <p><code>429</code> - Too Many Requests: Rate limit exceeded</p>
            <p><code>500</code> - Internal Server Error: Something went wrong</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>