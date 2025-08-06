import { useQuery } from "@tanstack/react-query";

import { getNichesByPlot } from "@/api/plots.api";

// 🗂️ Niche data structure matching database schema
interface NicheData {
  row: number;
  col: number;
  lot_id: string;
  niche_number: number;
  customer_id?: string;
  niche_status: "available" | "occupied" | "reserved";
  owner?: {
    customer_id: string;
    phone: string;
    email: string;
    name: string;
  };
  deceased?: {
    dateOfInterment: string;
    deceased_id: string;
    dateOfBirth: string;
    dateOfDeath: string;
    name: string;
  };
}

// 🧮 Generate grid positions and fill empty niches
const generateGridPositions = (
  fetchedNiches: NicheData[],
  totalRows: number,
  totalCols: number,
  plotId: string
): NicheData[] => {
  const result: NicheData[] = [];

  // 📊 Create a map of existing niches by niche_number
  const nicheMap = new Map<number, NicheData>();
  fetchedNiches.forEach((niche) => {
    if (niche.niche_number) {
      nicheMap.set(niche.niche_number, niche);
    }
  });

  console.log(
    "🗺️ Creating grid for plot:",
    plotId,
    "with dimensions:",
    totalRows,
    "x",
    totalCols
  );
  console.log("🔍 Existing niches to map:", fetchedNiches);

  let nicheCounter = 1;
  for (let row = 1; row <= totalRows; row++) {
    for (let col = 1; col <= totalCols; col++) {
      const existingNiche = nicheMap.get(nicheCounter);

      if (existingNiche) {
        // 🎯 Use existing niche data but ensure row/col are correct for grid positioning
        result.push({
          ...existingNiche,
          row,
          col,
          niche_number: nicheCounter,
        });
        console.log(
          `✅ Mapped existing niche ${nicheCounter} with data:`,
          existingNiche.owner?.name || "No owner"
        );
      } else {
        // � Create empty niche for positions without data
        result.push({
          row,
          col,
          niche_status: "available",
          niche_number: nicheCounter,
          lot_id: `${plotId}-N-${nicheCounter}-R${row}C${col}`,
        });
      }
      nicheCounter++;
    }
  }

  console.log("🏁 Final grid result:", result.length, "niches generated");
  return result;
};

// �🏛️ Hook to fetch niche data for a specific plot/columbarium with grid generation
export function useNichesByPlot(plotId: string, rows: number, cols: number) {
  return useQuery({
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    staleTime: 5 * 60 * 1000, // 5 minutes - niches don't change frequently
    queryKey: ["niches", plotId, rows, cols],
    enabled: !!plotId && rows > 0 && cols > 0, // Only run if all required params exist
    queryFn: async () => {
      console.log("🚀 Fetching niche data for plot:", plotId);

      // 🏗️ Try to get existing niche data first
      let existingNiches: any[] = [];
      try {
        const response = await getNichesByPlot(plotId);
        existingNiches = response.nicheData || [];
        console.log("✅ Found existing niche data:", existingNiches);
      } catch (nicheError) {
        console.log(
          "ℹ️ No existing niche data found, will generate empty grid"
        );
        existingNiches = [];
      }

      // 🎯 Map existing niche data to our interface
      const plotNiches: NicheData[] = existingNiches.map((niche: any) => ({
        row: parseInt(niche.row) || 0,
        col: parseInt(niche.col) || 0,
        lot_id: niche.lot_id || niche.lot_id,
        niche_number: parseInt(niche.niche_number) || 0,
        niche_status: niche.niche_status || "available",
        owner: niche.customer_id
          ? {
              email: niche.email || "",
              customer_id: niche.customer_id,
              name: niche.customer_name || "",
              phone: niche.contact_number || "",
            }
          : undefined,
        deceased: niche.deceased_id
          ? {
              deceased_id: niche.deceased_id,
              name: niche.dead_fullname || "",
              dateOfBirth: niche.dead_birth_date || "",
              dateOfDeath: niche.dead_date_death || "",
              dateOfInterment: niche.dead_interment || "",
            }
          : undefined,
      }));

      console.log("🔍 Existing niches:", existingNiches);
      console.log("🎯 Mapped plotNiches:", plotNiches);
      console.log("📏 Grid dimensions:", { rows, cols, total: rows * cols });

      // 🧮 Generate grid positions for niches that don't have row/col data
      const completeNiches = generateGridPositions(
        plotNiches,
        rows,
        cols,
        plotId
      );

      console.log("✅ Niche data loaded:", completeNiches);
      return completeNiches;
    },
  });
}
