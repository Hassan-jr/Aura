export function FeatureExtraction({ hashtags, keySellingPoints, keyPhrases }) {
  return (
    <div className="bg-gray-900 text-gray-300 p-4 rounded-md font-mono text-sm">
      <div>
        <h3 className="text-blue-400 mb-2">Key Phrases (Keywords):</h3>
        <pre>{JSON.stringify(keyPhrases, null, 2)}</pre>
      </div>
      <div className="mb-4">
        <h3 className="text-blue-400 mb-2">Hashtags:</h3>
        <pre>{JSON.stringify(hashtags, null, 2)}</pre>
      </div>
      <div className="mb-4">
        <h3 className="text-blue-400 mb-2">Trending Topics:</h3>
        <pre>{JSON.stringify(keySellingPoints, null, 2)}</pre>
      </div>
    </div>
  );
}
