export function SearchResult({ result }) {
    return (
      <div className="max-w-2xl">
        <div className="group">
          <a href={result.link} className="text-xl text-blue-800 hover:underline">{result.title}</a>
          <cite className="text-green-700 text-sm not-italic block">{result.link}</cite>
        </div>
        <p className="text-sm text-gray-600 mt-1">{result.snippet}</p>
      </div>
    )
  }
  
  