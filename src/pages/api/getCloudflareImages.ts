import type { APIRoute } from 'astro'
import dayjs from 'dayjs'
import probe from 'probe-image-size'

// Cloudflare Images APIのレスポンス型を定義
interface CloudflareImageData {
  result: {
    images: Array<{
      id: string
      uploaded: string
      variants: string[]
    }>
  }
  success: boolean
}

export const GET: APIRoute = async () => {
  const accountId = import.meta.env.CLOUDFLARE_ACCOUNT_ID
  const apiToken = import.meta.env.CLOUDFLARE_API_TOKEN
  const accountHash = import.meta.env.CLOUDFLARE_ACCOUNT_HASH

  const listResponse = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      cf: {
        cacheEverything: true,
        cacheTtl: 86400,
      },
    },
  )

  const data = (await listResponse.json()) as CloudflareImageData

  const images = await Promise.all(
    data.result.images.map(async (image: any) => {
      return {
        id: image.id,
        uploaded: dayjs(image.uploaded).format('YYYY/MM/DD HH:mm:ss'),
        variants: image.variants,
        publicUrl: `https://imagedelivery.net/${accountHash}/${image.id}/public`,
        thumbnailUrl: `https://imagedelivery.net/${accountHash}/${image.id}/thumbnail`,
      }
    }),
  )

  async function getImageSize(url: string) {
    try {
      const result = await probe(url)
      return result
    } catch (error) {
      console.error('Error getting image size:', error)
      throw error
    }
  }

  const imagesWithSizes = await Promise.all(
    images.map(async (image) => {
      const publicUrl = image.publicUrl
      const thumbnailUrl = image.thumbnailUrl

      // 並行して両方のサイズを取得
      const [publicDimensions, thumbnailDimensions] = await Promise.all([
        getImageSize(publicUrl),
        getImageSize(thumbnailUrl),
      ])

      return {
        ...image,
        publicHeight: publicDimensions.height,
        thumbnailHeight: thumbnailDimensions.height,
        publicWidth: publicDimensions.width,
        thumbnailWidth: thumbnailDimensions.width,
      }
    }),
  )

  return new Response(JSON.stringify(imagesWithSizes), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
