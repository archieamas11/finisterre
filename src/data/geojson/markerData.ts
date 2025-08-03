export interface MarkerData {
  position: [number, number];
  location: string;
  plotStatus: "Reserved" | "Available" | "Occupied";
  dimensions: { length: number; width: number; area: number };
  category: "Bronze" | "Silver" | "Platinum";
}

export const markerData: MarkerData[] = [
  {
    position: [10.249193799481978, 123.797692851286868],
    location: "Block A • Grave 1",
    plotStatus: "Reserved",
    dimensions: { length: 2.5, width: 1.2, area: 3.0 },
    category: "Bronze",
  },
  {
    position: [10.249206732588634, 123.797722187948295],
    location: "Block A • Grave 2",
    plotStatus: "Available",
    dimensions: { length: 2.5, width: 1.2, area: 3.0 },
    category: "Silver",
  },
  {
    position: [10.249221975177946, 123.79775692255545],
    location: "Block A • Grave 3",
    plotStatus: "Reserved",
    dimensions: { length: 2.5, width: 1.2, area: 3.0 },
    category: "Platinum",
  },
  {
    position: [10.249236063024993, 123.797788723496438],
    location: "Block A • Grave 4",
    plotStatus: "Available",
    dimensions: { length: 2.5, width: 1.2, area: 3.0 },
    category: "Bronze",
  },
  {
    position: [10.249178787839657, 123.797734274652811],
    location: "Block A • Grave 5",
    plotStatus: "Reserved",
    dimensions: { length: 2.5, width: 1.2, area: 3.0 },
    category: "Silver",
  },
  {
    position: [10.249166316628575, 123.797703764524925],
    location: "Block A • Grave 6",
    plotStatus: "Available",
    dimensions: { length: 2.5, width: 1.2, area: 3.0 },
    category: "Platinum",
  },
  {
    position: [10.249251074664597, 123.797823223410276],
    location: "Block A • Grave 7",
    plotStatus: "Reserved",
    dimensions: { length: 2.5, width: 1.2, area: 3.0 },
    category: "Bronze",
  },
  {
    position: [10.249193799481978, 123.797769009259952],
    location: "Block A • Grave 8",
    plotStatus: "Available",
    dimensions: { length: 2.5, width: 1.2, area: 3.0 },
    category: "Silver",
  },
  {
    position: [10.249206963536963, 123.797801162240901],
    location: "Block A • Grave 9",
    plotStatus: "Occupied",
    dimensions: { length: 2.5, width: 1.2, area: 3.0 },
    category: "Platinum",
  },
  {
    position: [10.249222206126264, 123.797836131541331],
    location: "Block A • Grave 10",
    plotStatus: "Occupied",
    dimensions: { length: 2.5, width: 1.2, area: 3.0 },
    category: "Bronze",
  },
];
