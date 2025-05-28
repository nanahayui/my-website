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
    console.log('Getting image size for:', url)
    // タイムアウトを設定（10秒）
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const result = await probe(url, { signal: controller.signal })
    clearTimeout(timeoutId)

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

// 並行処理数を制限する関数
async function processImagesInBatches<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 5,
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    console.log(
      `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`,
    )

    const batchResults = await Promise.all(batch.map(processor))
    results.push(...batchResults)
  }

  return results
}

export async function fetchGalleryImages(cursor?: string): Promise<CloudflareResponse> {
  console.log('Fetching gallery images...')

  try {
    const workerApiUrl = import.meta.env.CLOUDFLARE_WORKER_API_URL
    console.log('Worker API URL:', workerApiUrl)

    if (!workerApiUrl) {
      console.error('CLOUDFLARE_WORKER_API_URL is not configured')
      throw new Error('CLOUDFLARE_WORKER_API_URL is not configured')
    }

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

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error response:', errorText)
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data: CloudflareResponse = await response.json()
    console.log('Received data:', { imageCount: data.images.length, truncated: data.truncated })

    // 各画像のサイズをバッチ処理で取得（並行数を5に制限）
    console.log('Starting image size detection...')
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
      5, // 並行処理数
    )

    console.log('Image processing complete:', imagesWithSizes.length)

    return {
      ...data,
      images: imagesWithSizes,
    }
  } catch (error) {
    console.error('Error in fetchGalleryImages service:', error)
    throw error
  }
}
