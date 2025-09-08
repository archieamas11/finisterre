const arcgisSatelliteStyle = {
  version: 8 as const,
  sources: {
    'arcgis-imagery': {
      type: 'raster' as const,
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      minzoom: 1,
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'arcgis-imagery-layer',
      type: 'raster' as const,
      source: 'arcgis-imagery',
      paint: {
        'raster-fade-duration': 100,
      },
    },
  ],
}

export default arcgisSatelliteStyle
