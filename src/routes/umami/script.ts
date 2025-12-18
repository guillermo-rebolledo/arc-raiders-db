import { createFileRoute } from '@tanstack/react-router'

/**
 * Proxy route for Umami analytics script.js
 * This serves the script through our domain to avoid ad blockers
 * Route path: /umami/script.js
 */
export const Route = createFileRoute('/umami/script')({
  component: () => null, // Server handler will handle the response
  server: {
    handlers: {
      GET: async () => {
        try {
          const targetUrl = 'https://cloud.umami.is/script.js'

          // Fetch the script from Umami
          const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
              referer: 'https://cloud.umami.is/',
            },
          })

          if (!response.ok) {
            throw new Error(
              `Failed to fetch Umami script: ${response.statusText}`,
            )
          }

          // Get the script content
          let text = await response.text()

          // Modify the script to use the proxy endpoint for API calls
          text = text.replace(/https:\/\/cloud\.umami\.is\/api/g, '/umami/api')
          text = text.replace(/cloud\.umami\.is\/api/g, '/umami/api')
          text = text.replace(
            /["']https:\/\/[^"']*\/api\/send["']/g,
            "'/umami/api/send'",
          )

          // Return the modified script with proper headers
          return new Response(text, {
            status: 200,
            headers: {
              'Content-Type': 'application/javascript; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'public, max-age=3600',
            },
          })
        } catch (error) {
          console.error('Error proxying Umami script:', error)
          return new Response('Failed to load Umami script', {
            status: 502,
            headers: {
              'Content-Type': 'text/plain',
            },
          })
        }
      },
    },
  },
})
