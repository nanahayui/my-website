import type { APIRoute } from 'astro'
export const prerender = false

export const GET: APIRoute = () => {
  const data = { message: 'データ取得', timestamp: new Date().toISOString() }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
