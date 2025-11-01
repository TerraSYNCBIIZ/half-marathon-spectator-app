import { useState } from 'react';
import { parseKMZ } from '../utils/kmlParser';

const KMZParserPage = () => {
  const [parsedData, setParsedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const parsed = await parseKMZ(arrayBuffer);
      setParsedData(parsed);
      console.log('Parsed KMZ data:', parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse KMZ file');
      console.error('Error parsing KMZ:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyRouteToClipboard = () => {
    if (!parsedData?.routes?.[0]) return;
    
    const route = parsedData.routes[0];
    const routeString = route.map((coord: any) => 
      `    { lat: ${coord.lat}, lng: ${coord.lng} }`
    ).join(',\n');
    
    const fullCode = `route: [\n${routeString}\n  ]`;
    
    navigator.clipboard.writeText(fullCode);
    alert('Route data copied to clipboard! Paste it into raceData.ts');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">KMZ File Parser</h1>
      
      <div className="card mb-6">
        <label className="block mb-4">
          <span className="text-lg font-semibold mb-2 block">Upload KMZ File</span>
          <input
            type="file"
            accept=".kmz"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700"
          />
        </label>
      </div>

      {loading && (
        <div className="card text-center py-8">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Parsing KMZ file...</p>
        </div>
      )}

      {error && (
        <div className="card bg-red-50 border-red-200 text-red-800">
          <p className="font-semibold mb-2">Error:</p>
          <p>{error}</p>
          <details className="mt-4">
            <summary className="cursor-pointer font-semibold">Technical Details</summary>
            <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
              {error}
            </pre>
          </details>
        </div>
      )}

      {parsedData && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="card bg-green-50 border-green-200">
            <h2 className="text-xl font-bold text-green-900 mb-2">✅ File Parsed Successfully!</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold">Routes:</span> {parsedData.routes?.length || 0}
              </div>
              <div>
                <span className="font-semibold">Markers:</span> {parsedData.markers?.length || 0}
              </div>
              <div>
                <span className="font-semibold">Placemarks:</span> {parsedData.placemarks?.length || 0}
              </div>
            </div>
          </div>

          {/* Routes */}
          {parsedData.routes && parsedData.routes.length > 0 ? (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Routes Found: {parsedData.routes.length}
                </h2>
                <button onClick={copyRouteToClipboard} className="btn-primary">
                  Copy Route Data
                </button>
              </div>
              
              {parsedData.routes.map((route: any, index: number) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Route {index + 1}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {route.length} coordinate points
                  </p>
                  <p className="text-xs text-gray-500">
                    First: {route[0]?.lat}, {route[0]?.lng} | 
                    Last: {route[route.length - 1]?.lat}, {route[route.length - 1]?.lng}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="card bg-yellow-50 border-yellow-200">
              <h2 className="text-xl font-bold text-yellow-900 mb-2">⚠️ No Routes Found</h2>
              <p className="text-yellow-800">
                The KMZ file was parsed but no route (LineString) data was found. 
                This might mean the file contains only markers/points, or uses a different structure.
              </p>
            </div>
          )}

          {/* Markers */}
          {parsedData.markers && parsedData.markers.length > 0 ? (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Markers Found: {parsedData.markers.length}
              </h2>
              <div className="space-y-3">
                {parsedData.markers.map((marker: any, index: number) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-1">{marker.name}</h3>
                    <p className="text-sm text-gray-600">
                      {marker.coordinate.lat}, {marker.coordinate.lng}
                    </p>
                    {marker.description && (
                      <p className="text-sm text-gray-500 mt-1">{marker.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card bg-yellow-50 border-yellow-200">
              <h2 className="text-xl font-bold text-yellow-900 mb-2">⚠️ No Markers Found</h2>
              <p className="text-yellow-800">
                No point markers were found in the KMZ file.
              </p>
            </div>
          )}

          {/* Debug Info */}
          <details className="card">
            <summary className="cursor-pointer font-semibold text-gray-700 mb-4">
              🔍 Debug Information (Click to expand)
            </summary>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </details>

          {/* Instructions */}
          {parsedData.routes && parsedData.routes.length > 0 && (
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Click "Copy Route Data" button above to copy the route coordinates</li>
                <li>Open <code className="bg-blue-100 px-1 rounded">src/data/raceData.ts</code></li>
                <li>Find the <code className="bg-blue-100 px-1 rounded">route:</code> array (around line 10)</li>
                <li>Replace the entire route array with the copied data</li>
                <li>Save the file and refresh your app</li>
                <li>Go to <code className="bg-blue-100 px-1 rounded">/map</code> to see your route!</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KMZParserPage;
