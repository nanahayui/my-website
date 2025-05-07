import type { APIRoute } from 'astro'
export const prerender = false

export const GET: APIRoute = () => {
  const number = Math.random()
  const data = {
    message: `ランダムな数字はこちら: ${number}`,
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
