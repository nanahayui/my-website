import probe from 'probe-image-size'

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
async function getImageSize(url: string): Promise<{ width: number; height: number }> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const result = await probe(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    return {
      width: result.width,
      height: result.height,
    }
  } catch (error) {
    return {
      width: 1920,
      height: 1080,
    }
  }
}

// 並行処理数を制限する関数
async function processImagesInBatches<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 5,
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(processor))
    results.push(...batchResults)
  }

  return results
}

export async function fetchGalleryImages(cursor?: string): Promise<CloudflareResponse> {
  try {
    const workerApiUrl = import.meta.env.CLOUDFLARE_WORKER_API_URL

    if (!workerApiUrl) {
      throw new Error('CLOUDFLARE_WORKER_API_URL is not configured')
    }

    const apiUrl = cursor
      ? `${workerApiUrl}/list?cursor=${encodeURIComponent(cursor)}`
      : `${workerApiUrl}/list`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data: CloudflareResponse = await response.json()

    // 各画像のサイズをバッチ処理で取得
    const imagesWithSizes = await processImagesInBatches(
      data.images,
      async (image) => {
        const dimensions = await getImageSize(image.url)
        return {
          ...image,
          width: dimensions.width,
          height: dimensions.height,
        }
      },
      5,
    )

    return {
      ...data,
      images: imagesWithSizes,
    }
  } catch (error) {
    throw error
  }
}
