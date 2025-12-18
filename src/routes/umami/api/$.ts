import { createFileRoute } from '@tanstack/react-router'

/**
 * Proxy route for Umami analytics API endpoints
 * This proxies all API requests to avoid ad blockers
 */
export const Route = createFileRoute('/umami/api/$')({
  component: () => null, // Server handler will handle the response
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        try {
          // Get the API path (everything after /umami/api/)
          const apiPath = params._splat || '/send'
          const targetUrl = `https://cloud.umami.is/api${apiPath}`

          // Get the request body
          const body = await request.text()

          // Forward the request to Umami
          const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              referer: 'https://cloud.umami.is/',
            },
            body: body || undefined,
          })

          if (!response.ok) {
            throw new Error(`Failed to proxy Umami API: ${response.statusText}`)
          }

          // Get the response data
          const responseData = await response.text()

          // Return the response with proper headers
          return new Response(responseData, {
            status: response.status,
            headers: {
              'Content-Type':
                response.headers.get('Content-Type') || 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            },
          })
        } catch (error) {
          console.error('Error proxying Umami API request:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to proxy request' }),
            {
              status: 502,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
        }
      },
      GET: async ({ request, params }) => {
        try {
          // Get the API path
          const apiPath = params._splat || '/'
          const url = new URL(request.url)
          const targetUrl = `https://cloud.umami.is/api${apiPath}${url.search}`

          // Forward the request to Umami
          const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
              referer: 'https://cloud.umami.is/',
            },
          })

          if (!response.ok) {
            throw new Error(`Failed to proxy Umami API: ${response.statusText}`)
          }

          // Get the response data
          const responseData = await response.text()

          // Return the response with proper headers
          return new Response(responseData, {
            status: response.status,
            headers: {
              'Content-Type':
                response.headers.get('Content-Type') || 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            },
          })
        } catch (error) {
          console.error('Error proxying Umami API request:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to proxy request' }),
            {
              status: 502,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
        }
      },
      OPTIONS: async () => {
        // Handle CORS preflight requests
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        })
      },
    },
  },
})
