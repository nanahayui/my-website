interface ImageSizeCache {
  [url: string]: {
    width: number
    height: number
    timestamp: number
  }
}

interface CachedDimensions {
  width: number
  height: number
}

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7日間
const CACHE_KEY = 'gallery-image-size-cache'

class ImageSizeCacheManager {
  private cache: ImageSizeCache = {}

  constructor() {
    this.loadCache()
  }

  private loadCache(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const cachedData = localStorage.getItem(CACHE_KEY)
        if (cachedData) {
          this.cache = JSON.parse(cachedData)
          // 期限切れエントリを削除
          this.cleanExpiredEntries()
        }
      }
    } catch (error) {
      console.warn('Failed to load image size cache:', error)
      this.cache = {}
    }
  }

  private saveCache(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CACHE_KEY, JSON.stringify(this.cache))
      }
    } catch (error) {
      console.warn('Failed to save image size cache:', error)
    }
  }

  private cleanExpiredEntries(): void {
    const now = Date.now()
    const validEntries: ImageSizeCache = {}

    for (const [url, entry] of Object.entries(this.cache)) {
      if (now - entry.timestamp < CACHE_DURATION) {
        validEntries[url] = entry
      }
    }

    this.cache = validEntries
  }

  get(url: string): CachedDimensions | null {
    const entry = this.cache[url]
    if (!entry) {
      return null
    }

    // キャッシュが期限切れかチェック
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      delete this.cache[url]
      this.saveCache()
      return null
    }

    return {
      width: entry.width,
      height: entry.height,
    }
  }

  set(url: string, dimensions: CachedDimensions): void {
    this.cache[url] = {
      ...dimensions,
      timestamp: Date.now(),
    }
    this.saveCache()
  }

  clear(): void {
    this.cache = {}
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(CACHE_KEY)
    }
  }

  size(): number {
    return Object.keys(this.cache).length
  }
}

// シングルトンインスタンス
export const imageSizeCache = new ImageSizeCacheManager()
