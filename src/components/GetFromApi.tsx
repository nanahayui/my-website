const fetchData = async () => {
  const response = await fetch('/api/hello')
  if (!response.ok) {
    throw new Error('データ取得失敗')
  }
  return response.json()
}

export default function GetFromApi() {
  fetchData()
    .then((data) => {
      return <div>{JSON.stringify(data)}</div>
    })
    .catch((error) => {
      return <div>Error</div>
    })
}
