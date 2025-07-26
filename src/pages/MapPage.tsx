
export default function MapPage() {
function MapEmbed() {
  return (
    <iframe
      src="/src/pages/qgis2web_2025_07_18-00_39_53_251435/index.html"
      width="100%"
      height="600"
      style={{ border: "none" }}
    />
  )
}


  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white  dark:bg-stone-900 border dark:border-stone-700">
        <h2 className="text-2xl font-bold mb-4">Finisterre Gardenz Map</h2>
        <div className="w-full max-w-4xl h-[600px] border rounded shadow">
          <MapEmbed />
          </div>
      </div>
  );
}
