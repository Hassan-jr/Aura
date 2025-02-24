import ReactMarkdown from 'react-markdown'

export function AnalysisReport({ report, run }) {
  return (
    <div className="prose max-w-none p-4">
      <ReactMarkdown>
        {report}
        </ReactMarkdown>
        
      <div>
      <div className="mb-4">
        <h3 className="text-blue-600 mb-2 text-xl mt-2">Key Selling Points</h3>
        <pre>{JSON.stringify(run.analysis.key_selling_points, null, 2)}</pre>
      </div>

      <div className="mb-4">
        <h3 className="text-blue-600 mb-2 text-xl mt-2">Traget Audience</h3>
        <pre>{JSON.stringify(run.analysis.target_audience, null, 2)}</pre>
      </div>
      </div>
    </div>
  )
}

