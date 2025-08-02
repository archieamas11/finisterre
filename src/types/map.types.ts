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
  file_names_array?: string[];
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
  coordinates: [number, number];
  file_names: string[];
  file_names_array?: string[];
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
  file_name?: string[];
  file_names_array?: string[];
}): ConvertedMarker => {
  // 📍 Parse coordinates from database format "lng, lat" to [lat, lng]
  const [lng, lat] = plot.coordinates.split(", ").map(Number);

  // 🖼️ Handle file_name conversion - ensure it's always an array
  let fileNames: string[] = [];

  // 🔍 Check multiple sources for image files
  if (plot.file_names_array && Array.isArray(plot.file_names_array)) {
    fileNames = plot.file_names_array.filter(Boolean); // Remove empty strings
  } else if (plot.file_name) {
    if (Array.isArray(plot.file_name)) {
      fileNames = plot.file_name.filter(Boolean);
    } else if (typeof plot.file_name === "string") {
      // 🔧 Handle case where backend sends JSON string or comma-separated
      try {
        const parsed = JSON.parse(plot.file_name);
        fileNames = Array.isArray(parsed)
          ? parsed.filter(Boolean)
          : [plot.file_name];
      } catch {
        // 📝 Might be comma-separated string
        fileNames = (plot.file_name as string)
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
    }
  }

  console.log("🔄 Converting plot:", {
    plot_id: plot.plot_id,
    original_file_name: plot.file_name,
    original_file_names_array: plot.file_names_array,
    converted_fileNames: fileNames,
  });

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
    file_names_array: fileNames.length > 0 ? fileNames : undefined,
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
      return "#6b7280";
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
