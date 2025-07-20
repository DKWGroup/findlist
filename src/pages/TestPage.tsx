import { ProductStatsService } from "../services/productStatsService";

export default function TestPage() {
  const testProductId = "2c4f440e-c5a9-4cb5-8f0a-f6a103a510b5"; // przykładowy UUID

  const handleTestIncrement = async () => {
    console.log("=== TESTING INCREMENT VIEWS ===");

    // Najpierw debug
    await ProductStatsService.debugProductStats(testProductId);

    // Potem test normalnej funkcji
    const result = await ProductStatsService.incrementViews(testProductId);
    console.log("incrementViews result:", result);

    // I znów debug żeby zobaczyć zmiany
    await ProductStatsService.debugProductStats(testProductId);
  };

  const handleGetStats = async () => {
    const stats = await ProductStatsService.getProductStats(testProductId);
    console.log("Current stats:", stats);
  };

  const handleTestAlternative = async () => {
    console.log("=== TESTING ALTERNATIVE INCREMENT ===");

    // Debug przed
    await ProductStatsService.debugProductStats(testProductId);

    // Test alternatywnej funkcji
    const result = await ProductStatsService.incrementViewsAlternative(
      testProductId
    );
    console.log("incrementViewsAlternative result:", result);

    // Debug po
    await ProductStatsService.debugProductStats(testProductId);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Product Stats</h1>
      <div className="space-y-4">
        <button
          onClick={handleTestIncrement}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Increment Views (check console)
        </button>
        <button
          onClick={handleGetStats}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Get Current Stats (check console)
        </button>
        <button
          onClick={handleTestAlternative}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Test Alternative Increment (check console)
        </button>
        <div className="text-sm text-gray-600">
          <p>Test Product ID: {testProductId}</p>
          <p>Check browser console for detailed logs</p>
        </div>
      </div>
    </div>
  );
}
