import { useState } from "react";
import "./App.css";

interface Result {
  file: string;
  pattern: string;
  details: string;
  severity?: string;
}

function App() {
  const [repo, setRepo] = useState("");
  const [pattern, setPattern] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Helper for severity color styling
  const getSeverityColor = (level?: string) => {
    switch (level) {
      case "Extreme":
        return "bg-red-600 text-white";
      case "Severe":
        return "bg-orange-500 text-white";
      case "Moderate":
        return "bg-yellow-400 text-black";
      case "None":
        return "bg-green-300 text-gray-800";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  // ✅ Compute Summary Stats
  const getSummary = () => {
    if (results.length === 0) return null;
    const total = results.length;
    const severe = results.filter((r) => r.severity === "Severe").length;
    const extreme = results.filter((r) => r.severity === "Extreme").length;
    const moderate = results.filter((r) => r.severity === "Moderate").length;
    const none = results.filter((r) => r.severity === "None").length;

    // Extract LOC from details
    const locValues = results
      .map((r) => {
        const match = r.details.match(/LOC=(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => n > 0);

    const avgLoc =
      locValues.length > 0
        ? Math.round(locValues.reduce((a, b) => a + b, 0) / locValues.length)
        : 0;

    return { total, severe, extreme, moderate, none, avgLoc };
  };

  const summary = getSummary();

  // ✅ Fetch detection results from backend
  const runDetection = async () => {
    if (!repo || !pattern)
      return alert("Please select both repository and pattern");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5050/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo, patterns: [pattern] }),
      });

      if (!res.ok) {
        console.error("Server error:", await res.text());
        alert("Server error — check backend logs.");
        return;
      }

      const data = await res.json();
      console.log("🔍 Backend data received:", data);
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error running detector:", error);
      alert("Error connecting to backend. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
        ⚙️ React Pattern Detector
      </h1>

      {/* --- Input Controls --- */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <select
          className="border p-2 rounded w-48"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        >
          <option value="">Select Repository</option>
          <option value="mattermost-webapp">Mattermost</option>
          <option value="grafana">Grafana</option>
          <option value="todomvc">TodoMVC</option>
          <option value="refine">Refine</option>
        </select>

        <select
          className="border p-2 rounded w-48"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
        >
          <option value="">Select Pattern</option>
          <option value="god">God Component</option>
          <option value="propdrilling">Prop Drilling</option>
          <option value="inlinefunction">Inline Function</option>
          <option value="duplicatestate">Duplicate State</option>
          <option value="deepnesting">Deep JSX Nesting</option>
          <option value="useeffect">useEffect Dependency Issue</option>
        </select>

        <button
          onClick={runDetection}
          className={`px-6 py-2 rounded text-white font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Run"}
        </button>
      </div>

      {/* --- Summary Cards --- */}
      {summary && (
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-center">
          <div className="bg-white shadow p-4 rounded-lg w-40">
            <p className="text-gray-600 text-sm">Total Results</p>
            <p className="text-xl font-bold text-blue-600">{summary.total}</p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg w-40">
            <p className="text-gray-600 text-sm">Moderate</p>
            <p className="text-xl font-bold text-yellow-500">
              {summary.moderate}
            </p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg w-40">
            <p className="text-gray-600 text-sm">Severe</p>
            <p className="text-xl font-bold text-orange-500">
              {summary.severe}
            </p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg w-40">
            <p className="text-gray-600 text-sm">Extreme</p>
            <p className="text-xl font-bold text-red-600">{summary.extreme}</p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg w-40">
            <p className="text-gray-600 text-sm">Avg. LOC</p>
            <p className="text-xl font-bold text-gray-800">{summary.avgLoc}</p>
          </div>
        </div>
      )}

      {/* --- Results Table --- */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="border p-2 text-left">File</th>
              <th className="border p-2 text-left">Pattern</th>
              <th className="border p-2 text-left">Details</th>
              <th className="border p-2 text-left">Severity</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center p-4 text-gray-500 italic"
                >
                  No results yet. Select a repo and pattern to begin.
                </td>
              </tr>
            ) : (
              results.map((r, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition border-b border-gray-200"
                >
                  <td className="border p-2">{r.file}</td>
                  <td className="border p-2">{r.pattern}</td>
                  <td className="border p-2">{r.details}</td>
                  <td className="border p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(
                        r.severity
                      )}`}
                    >
                      {r.severity || "N/A"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
