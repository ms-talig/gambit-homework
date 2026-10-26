import { describe, expect, it } from 'vitest'
import { resources } from '../../../../src/data/resources.ts'
import {
  computeGraphLayout,
  GRAPH_SIZES,
} from '../../../../src/features/applications/ApplicationGraph/graphLayout.ts'

interface Box {
  left: number
  right: number
  top: number
  bottom: number
}

function boxAround(x: number, y: number, width: number, height: number): Box {
  return {
    left: x - width / 2,
    right: x + width / 2,
    top: y - height / 2,
    bottom: y + height / 2,
  }
}

function intersects(a: Box, b: Box) {
  return (
    a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
  )
}

const COUNTS = Array.from({ length: resources.length }, (_, index) => index + 1)

describe('computeGraphLayout', () => {
  it.each(COUNTS)(
    'places %i nodes inside the canvas without overlapping boxes',
    (count) => {
      const layout = computeGraphLayout(count)
      const { nodeWidth, nodeHeight, centerWidth, centerHeight } = GRAPH_SIZES
      const boxes = [
        boxAround(layout.center.x, layout.center.y, centerWidth, centerHeight),
        ...layout.nodes.map((node) =>
          boxAround(node.x, node.y, nodeWidth, nodeHeight),
        ),
      ]

      expect(layout.nodes).toHaveLength(count)
      for (const [index, box] of boxes.entries()) {
        expect(box.left).toBeGreaterThanOrEqual(0)
        expect(box.top).toBeGreaterThanOrEqual(0)
        expect(box.right).toBeLessThanOrEqual(layout.width)
        expect(box.bottom).toBeLessThanOrEqual(layout.height)
        for (const other of boxes.slice(index + 1)) {
          expect(intersects(box, other)).toBe(false)
        }
      }
    },
  )
})
