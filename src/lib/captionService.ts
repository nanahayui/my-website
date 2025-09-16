interface CaptionData {
  world: string
  people: string
}

interface CaptionsDatabase {
  [key: string]: CaptionData
}

// キャプションデータをインポート
import captionsData from '../data/captions.json'

/**
 * 画像ファイル名からキャプション情報を取得
 * @param imageName 画像ファイル名（例: "vrc_001.webp"）
 * @returns キャプション情報またはデフォルト値
 */
export function getCaptionData(imageName: string): CaptionData {
  const captions = captionsData as CaptionsDatabase

  // ファイル名からキャプション情報を取得
  const captionData = captions[imageName]

  if (captionData) {
    return captionData
  }

  // データが見つからない場合はデフォルト値を返す
  return {
    world: '',
    people: '',
  }
}

/**
 * URLからファイル名を抽出
 * @param url 画像のURL（例: "https://example.com/images/vrc_001.webp"）
 * @returns ファイル名（例: "vrc_001.webp"）
 */
export function extractFileNameFromUrl(url: string): string {
  // URLからファイル名部分を抽出
  const urlParts = url.split('/')
  return urlParts[urlParts.length - 1]
}
