export interface MarkerData {
  location: string
  position: [number, number]
  category: 'Platinum' | 'Bronze' | 'Silver'
  plotStatus: 'Available' | 'Reserved' | 'Occupied'
  dimensions: { length: number; width: number; area: number }
}

export const markerData: MarkerData[] = [
  {
    category: 'Bronze',
    plotStatus: 'Reserved',
    location: 'Block A • Grave 1',
    dimensions: { area: 3.0, width: 1.2, length: 2.5 },
    position: [10.249193799481978, 123.797692851286868],
  },
  {
    category: 'Silver',
    plotStatus: 'Available',
    location: 'Block A • Grave 2',
    dimensions: { area: 3.0, width: 1.2, length: 2.5 },
    position: [10.249206732588634, 123.797722187948295],
  },
  {
    category: 'Platinum',
    plotStatus: 'Reserved',
    location: 'Block A • Grave 3',
    position: [10.249221975177946, 123.79775692255545],
    dimensions: { area: 3.0, width: 1.2, length: 2.5 },
  },
  {
    category: 'Bronze',
    plotStatus: 'Available',
    location: 'Block A • Grave 4',
    dimensions: { area: 3.0, width: 1.2, length: 2.5 },
    position: [10.249236063024993, 123.797788723496438],
  },
  {
    category: 'Silver',
    plotStatus: 'Reserved',
    location: 'Block A • Grave 5',
    dimensions: { area: 3.0, width: 1.2, length: 2.5 },
    position: [10.249178787839657, 123.797734274652811],
  },
  {
    category: 'Platinum',
    plotStatus: 'Available',
    location: 'Block A • Grave 6',
    dimensions: { area: 3.0, width: 1.2, length: 2.5 },
    position: [10.249166316628575, 123.797703764524925],
  },
  {
    category: 'Bronze',
    plotStatus: 'Reserved',
    location: 'Block A • Grave 7',
    dimensions: { area: 3.0, width: 1.2, length: 2.5 },
    position: [10.249251074664597, 123.797823223410276],
  },
  {
    category: 'Silver',
    plotStatus: 'Available',
    location: 'Block A • Grave 8',
    dimensions: { area: 3.0, width: 1.2, length: 2.5 },
    position: [10.249193799481978, 123.797769009259952],
  },
  {
    category: 'Platinum',
    plotStatus: 'Occupied',
    location: 'Block A • Grave 9',
    dimensions: { area: 3.0, width: 1.2, length: 2.5 },
    position: [10.249206963536963, 123.797801162240901],
  },
  {
    category: 'Bronze',
    plotStatus: 'Occupied',
    location: 'Block A • Grave 10',
    dimensions: { area: 3.0, width: 1.2, length: 2.5 },
    position: [10.249222206126264, 123.797836131541331],
  },
]
