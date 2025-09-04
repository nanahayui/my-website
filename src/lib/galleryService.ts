import probe from 'probe-image-size'
import { imageSizeCache } from './imageSizeCache'

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

// 画像サイズを取得する関数（キャッシュ対応）
async function getImageSize(url: string): Promise<{ width: number; height: number }> {
  // まずキャッシュを確認
  const cachedDimensions = imageSizeCache.get(url)
  if (cachedDimensions) {
    return cachedDimensions
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 10秒から5秒に短縮

    const result = await probe(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    const dimensions = {
      width: result.width,
      height: result.height,
    }

    // 結果をキャッシュに保存
    imageSizeCache.set(url, dimensions)

    return dimensions
  } catch (error) {
    const defaultDimensions = {
      width: 1920,
      height: 1080,
    }

    // デフォルト値もキャッシュに保存（エラーを避けるため）
    imageSizeCache.set(url, defaultDimensions)

    return defaultDimensions
  }
}

// 並行処理数を制限する関数（最適化済み）
async function processImagesInBatches<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10, // 5から10に増加
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

    // 各画像のサイズをバッチ処理で取得（キャッシュ活用）
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
      10, // バッチサイズを10に増加
    )

    return {
      ...data,
      images: imagesWithSizes,
    }
  } catch (error) {
    throw error
  }
}

// キャッシュ統計取得用のユーティリティ関数
export function getCacheStats() {
  return {
    size: imageSizeCache.size(),
    clear: () => imageSizeCache.clear(),
  }
}
