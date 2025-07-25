export default function MapPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Finisterre Gardenz Map</h2>
      <div className="w-full max-w-4xl h-[600px] border rounded shadow">
        {/* Replace the src below with your actual QGIS2web map URL or local file path */}
        <iframe
          src="https://qgiscloud.com/your_sample_map_url_or_local_path/index.html"
          title="QGIS2web Map"
          width="100%"
          height="100%"
          style={{ border: "none", minHeight: "600px" }}
          allowFullScreen
        />
      </div>
    </div>
  );
}
