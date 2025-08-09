// Test script to verify the plot details functionality
import { getPlotDetails } from "@/api/plots.api";

export const testPlotDetails = async (plotId: string) => {
  console.log(`🧪 Testing plot details for plot ID: ${plotId}`);

  try {
    const response = await getPlotDetails(plotId);
    console.log("✅ API Response:", response);

    if (response.success) {
      console.log("👤 Owner:", response.owner);
      console.log("💀 Deceased (count):", response.deceased?.length || 0);
      console.log("💀 Deceased details:", response.deceased);
    } else {
      console.error("❌ API Error:", response.message);
    }
  } catch (error) {
    console.error("❌ Network Error:", error);
  }
};

// Test the years buried calculation
import { calculateYearsBuried } from "@/utils/dateUtils";

export const testYearsBuried = () => {
  console.log("🧪 Testing years buried calculation:");

  const testCases = [
    "2020-01-01", // Should show ~4-5 years
    "2024-01-01", // Should show ~1 year
    "2025-01-01", // Should show "less than a year"
    "2026-01-01", // Should show "less than a year" (future)
    "invalid-date", // Should show "N/A"
  ];

  testCases.forEach((date) => {
    console.log(`📅 ${date}: ${calculateYearsBuried(date)}`);
  });
};
