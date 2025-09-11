import { findClosestPointOnLine, type Coordinate } from '../utils/location.utils'

type ClosestMessage = { type: 'closest'; line: Coordinate[]; point: Coordinate }
type ClosestResult = { type: 'closestResult'; index: number; snapped: Coordinate }

self.onmessage = (event: MessageEvent<ClosestMessage>) => {
  const data = event.data
  if (!data) return
  if (data.type === 'closest') {
    const { line, point } = data
    if (!line || line.length === 0) return
    const { index, closestPoint } = findClosestPointOnLine(line, point)
    const result: ClosestResult = { type: 'closestResult', index, snapped: closestPoint }
    self.postMessage(result)
  }
}
