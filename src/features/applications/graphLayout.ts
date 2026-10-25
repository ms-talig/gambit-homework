export const GRAPH_SIZES = {
  nodeWidth: 200,
  nodeHeight: 56,
  centerWidth: 200,
  centerHeight: 64,
  // Minimum empty space between any two boxes.
  gap: 16,
  padding: 16,
  minRadiusY: 110,
  // Ellipse is wider than tall because the boxes are.
  aspectRatio: 1.6,
  radiusStep: 10,
} as const

export interface Point {
  x: number
  y: number
}

export interface GraphLayout {
  width: number
  height: number
  center: Point
  // Centers of the resource nodes, clockwise from the top.
  nodes: Point[]
}

interface Box extends Point {
  width: number
  height: number
}

function boxesOverlap(a: Box, b: Box, gap: number): boolean {
  return (
    Math.abs(a.x - b.x) < (a.width + b.width) / 2 + gap &&
    Math.abs(a.y - b.y) < (a.height + b.height) / 2 + gap
  )
}

function ellipsePoints(count: number, radiusY: number): Point[] {
  const radiusX = radiusY * GRAPH_SIZES.aspectRatio
  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / count
    return { x: radiusX * Math.cos(angle), y: radiusY * Math.sin(angle) }
  })
}

function hasOverlap(points: Point[]): boolean {
  const { nodeWidth, nodeHeight, centerWidth, centerHeight, gap } = GRAPH_SIZES
  const center: Box = { x: 0, y: 0, width: centerWidth, height: centerHeight }
  const boxes = points.map((point) => ({
    ...point,
    width: nodeWidth,
    height: nodeHeight,
  }))

  return boxes.some(
    (box, index) =>
      boxesOverlap(box, center, gap) ||
      boxes.slice(index + 1).some((other) => boxesOverlap(box, other, gap)),
  )
}

// Places resource nodes evenly on an ellipse around the application node,
// growing the ellipse until no boxes overlap. Deterministic for a given count.
export function computeGraphLayout(count: number): GraphLayout {
  const { nodeWidth, nodeHeight, centerWidth, centerHeight, padding } =
    GRAPH_SIZES

  let radiusY: number = GRAPH_SIZES.minRadiusY
  let points = ellipsePoints(count, radiusY)
  while (hasOverlap(points)) {
    radiusY += GRAPH_SIZES.radiusStep
    points = ellipsePoints(count, radiusY)
  }

  const halfWidth = Math.max(
    centerWidth / 2,
    ...points.map((point) => Math.abs(point.x) + nodeWidth / 2),
  )
  const halfHeight = Math.max(
    centerHeight / 2,
    ...points.map((point) => Math.abs(point.y) + nodeHeight / 2),
  )
  const center = { x: halfWidth + padding, y: halfHeight + padding }

  return {
    width: 2 * center.x,
    height: 2 * center.y,
    center,
    nodes: points.map((point) => ({
      x: center.x + point.x,
      y: center.y + point.y,
    })),
  }
}
