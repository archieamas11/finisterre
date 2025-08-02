// 🗺️ Types for map-related data structures

export type ConvertedMarker = {
  plot_id: string;
  position: [number, number];
  location: string;
  plotStatus: string;
  dimensions: {
    length: number;
    width: number;
    area: number;
  };
  category: string;
  block: string;
  label: string | null;
  file_name?: string[];
};

export type plots = {
  plot_id: string;
  block: string;
  category: string;
  length: string;
  width: string;
  area: string;
  status: string;
  label: string;
  coordinates: string;
  file_name?: string[] | string; // 🔧 Support both formats
};

// 🔧 Map utility functions
export const convertPlotToMarker = (plot: {
  plot_id: string;
  block: string;
  category: string;
  length: string;
  width: string;
  area: string;
  status: string;
  label: string | null;
  coordinates: string;
  file_name?: string[] | string; // 🔧 Handle both array and string format
}): ConvertedMarker => {
  // 📍 Parse coordinates from database format "lng, lat" to [lat, lng]
  const [lng, lat] = plot.coordinates.split(", ").map(Number);

  // 🖼️ Handle file_name conversion - ensure it's always an array
  let fileNames: string[] = [];
  if (plot.file_name) {
    if (Array.isArray(plot.file_name)) {
      fileNames = plot.file_name;
    } else if (typeof plot.file_name === "string") {
      // 🔧 Handle case where backend sends JSON string
      try {
        const parsed = JSON.parse(plot.file_name);
        fileNames = Array.isArray(parsed) ? parsed : [plot.file_name];
      } catch {
        fileNames = [plot.file_name];
      }
    }
  }

  return {
    plot_id: plot.plot_id,
    position: [lat, lng] as [number, number],
    location: `Block ${plot.block} • Plot ${plot.plot_id}`,
    plotStatus: plot.status,
    dimensions: {
      length: parseFloat(plot.length),
      width: parseFloat(plot.width),
      area: parseFloat(plot.area),
    },
    category: plot.category,
    block: plot.block,
    label: plot.label,
    file_name: fileNames.length > 0 ? fileNames : undefined,
  };
};

// 🎨 Get background color based on plot category
export const getCategoryBackgroundColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case "bronze":
      return "#7d7d7d";
    case "silver":
      return "#b00020";
    case "platinum":
      return "#d4af37";
    case "diamond":
      return "#cc6688";
    default:
      return "#6b7280"; // Default gray
  }
};

// 🟢 Get status color for map markers
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "available":
      return "#22c55e";
    case "occupied":
      return "#ef4444";
    case "reserved":
      return "#facc15";
    default:
      return "#a3a3a3";
  }
};
