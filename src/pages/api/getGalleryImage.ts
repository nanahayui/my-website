import type { APIRoute } from 'astro'
export const prerender = false

import probe from 'probe-image-size'

// レスポンスの型定義
interface ImageItem {
  name: string
  size: number
  uploaded: string
  type: string
  url: string
  width?: number
  height?: number
}

interface CloudflareResponse {
  images: ImageItem[]
  truncated: boolean
  cursor?: string
}

// 画像サイズを取得する関数
async function getImageSize(url: string) {
  console.log('Getting image size for:', url)
  try {
    const result = await probe(url)
    console.log('Image size result:', { url, width: result.width, height: result.height })
    return {
      width: result.width,
      height: result.height,
    }
  } catch (error) {
    console.error('Error getting image size for:', url, error)
    // デフォルトサイズを返す
    return {
      width: 1920,
      height: 1080,
    }
  }
}

export const GET: APIRoute = async (context) => {
  console.log('API called:', context.request.url)

  try {
    // 環境変数からWorker APIのURLを取得
    const workerApiUrl = import.meta.env.CLOUDFLARE_WORKER_API_URL
    console.log('Worker API URL:', workerApiUrl)

    if (!workerApiUrl) {
      console.error('CLOUDFLARE_WORKER_API_URL is not configured')
      throw new Error('CLOUDFLARE_WORKER_API_URL is not configured')
    }

    // クエリパラメータからcursorを取得（ページネーション用）
    const url = new URL(context.request.url)
    const cursor = url.searchParams.get('cursor')
    console.log('Cursor parameter:', cursor)

    // Cloudflare Workers APIを呼び出し
    const apiUrl = cursor
      ? `${workerApiUrl}/list?cursor=${encodeURIComponent(cursor)}`
      : `${workerApiUrl}/list`

    console.log('Fetching from API URL:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('API response status:', response.status)
    console.log('API response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error response:', errorText)
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data: CloudflareResponse = await response.json()
    console.log('Received data:', { imageCount: data.images.length, truncated: data.truncated })

    // 各画像のサイズを並行して取得
    console.log('Starting image size detection...')
    const imagesWithSizes = await Promise.all(
      data.images.map(async (image) => {
        const dimensions = await getImageSize(image.url)
        return {
          ...image,
          width: dimensions.width,
          height: dimensions.height,
        }
      }),
    )

    console.log('Image processing complete:', imagesWithSizes.length)

    // サイズ情報を含むレスポンスを返す
    const enhancedData = {
      ...data,
      images: imagesWithSizes,
    }

    return new Response(JSON.stringify(enhancedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error in getGalleryImage API:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')

    return new Response(
      JSON.stringify({
        error: 'Failed to fetch data from Cloudflare Workers',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
