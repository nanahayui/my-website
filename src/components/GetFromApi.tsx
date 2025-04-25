import { useState, useEffect } from 'react'

interface ApiData {
  message: string
  timestamp: string
}

const fetchData = async (): Promise<ApiData> => {
  try {
    const response = await fetch('/api/hello')
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('API呼び出しエラー:', error)
    return { message: 'エラー発生', timestamp: '取得失敗' }
  }
}

export default function GetFromApi() {
  const [data, setData] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const result = await fetchData()
        if (isMounted) {
          setData(result)
          setLoading(false)
        }
      } catch (error) {
        if (isMounted) {
          console.error(error)
          setLoading(false)
        }
      }
    }

    loadData()

    // コンポーネントのアンマウント時にisMountedをfalseに
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">読み込み中...</p>
      ) : data ? (
        <div className="space-y-2">
          <p>
            <span className="font-bold">メッセージ:</span> {data.message}
          </p>
          <p>
            <span className="font-bold">タイムスタンプ:</span> {data.timestamp}
          </p>
        </div>
      ) : (
        <p className="text-red-600 dark:text-red-400">データを取得できませんでした</p>
      )}
    </div>
  )
}
