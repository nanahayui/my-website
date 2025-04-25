import { useState, useEffect } from 'react'

interface ApiData {
  message: string
  timestamp: string
}

const fetchData = async (): Promise<ApiData> => {
  try {
    const response = await fetch('/api/hello')
    if (!response.ok) {
      throw new Error('データ取得失敗')
    }
    return response.json()
  } catch (error) {
    console.error('API呼び出しエラー:', error)
    throw error
  }
}

export default function GetFromApi() {
  const [data, setData] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // コンポーネントマウント時にデータ取得
    const loadData = async () => {
      try {
        setLoading(true)
        const result = await fetchData()
        setData(result)
        setError(null)
      } catch (error) {
        setError('データ取得中にエラーが発生しました')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // ローディング中
  if (loading) {
    return (
      <div className="rounded bg-gray-100 p-4 dark:bg-gray-800 dark:text-white">読み込み中...</div>
    )
  }

  // エラー発生時
  if (error) {
    return <div className="rounded bg-red-100 p-4 dark:bg-red-900 dark:text-white">{error}</div>
  }

  // データ表示
  return (
    <div className="rounded bg-white p-4 shadow dark:bg-gray-800 dark:text-white">
      <h2 className="mb-3 text-lg font-medium">API Response</h2>
      {data && (
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="mr-2 font-semibold">Message:</span>
            <span>{data.message}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 font-semibold">Timestamp:</span>
            <span className="font-mono">{data.timestamp}</span>
          </div>
          <pre className="mt-4 overflow-auto rounded bg-gray-100 p-3 text-xs dark:bg-gray-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <button
        onClick={() => {
          setLoading(true)
          fetchData()
            .then((result) => {
              setData(result)
              setError(null)
            })
            .catch((err) => {
              setError('再読み込み中にエラーが発生しました')
            })
            .finally(() => {
              setLoading(false)
            })
        }}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        再読み込み
      </button>
    </div>
  )
}
