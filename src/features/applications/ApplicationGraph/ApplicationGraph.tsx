import { useId } from 'react'
import { UI_TEXT } from '../../../text/uiText.ts'
import { VisuallyHidden } from '../../../components/ui/VisuallyHidden/VisuallyHidden.tsx'
import type { Application, Resource } from '../../../types/models.ts'
import { computeGraphLayout, GRAPH_SIZES } from './graphLayout.ts'
import styles from './ApplicationGraph.module.css'

const TEXT = UI_TEXT.applications.graph

// Smallest on-screen scale before the graph scrolls instead of shrinking,
// so labels stay readable.
const MIN_SCALE = 0.8
const NODE_RADIUS = 10
// Baseline offsets of the two text lines from a node's center.
const PRIMARY_LINE_OFFSET = -3
const SECONDARY_LINE_OFFSET = 15
// SVG text does not wrap; longer labels are shortened to fit a node. The full
// text is in the heading and the screen-reader member list.
const MAX_LABEL_CHARS = 22
const ELLIPSIS = '…'

function fitLabel(text: string) {
  return text.length > MAX_LABEL_CHARS
    ? `${text.slice(0, MAX_LABEL_CHARS - 1)}${ELLIPSIS}`
    : text
}

interface ApplicationGraphProps {
  application: Application
  resources: Resource[]
}

export function ApplicationGraph({
  application,
  resources,
}: ApplicationGraphProps) {
  const titleId = useId()
  const descriptionId = useId()
  const layout = computeGraphLayout(resources.length)
  const { center } = layout
  const { nodeWidth, nodeHeight, centerWidth, centerHeight } = GRAPH_SIZES

  return (
    <div className={styles.container}>
      <svg
        className={styles.graph}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        style={{
          minWidth: layout.width * MIN_SCALE,
          maxWidth: layout.width,
        }}
        role="img"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <title id={titleId}>{TEXT.title(application.name)}</title>
        <desc id={descriptionId}>
          {TEXT.description(application.name, resources.length)}
        </desc>

        {layout.nodes.map((node, index) => (
          <line
            key={resources[index].id}
            className={styles.edge}
            x1={center.x}
            y1={center.y}
            x2={node.x}
            y2={node.y}
          />
        ))}

        <rect
          className={styles.centerNode}
          x={center.x - centerWidth / 2}
          y={center.y - centerHeight / 2}
          width={centerWidth}
          height={centerHeight}
          rx={NODE_RADIUS}
        />
        <text
          className={styles.centerName}
          x={center.x}
          y={center.y + PRIMARY_LINE_OFFSET}
        >
          {fitLabel(application.name)}
        </text>
        <text
          className={styles.centerLabel}
          x={center.x}
          y={center.y + SECONDARY_LINE_OFFSET}
        >
          {TEXT.applicationNodeLabel}
        </text>

        {layout.nodes.map((node, index) => {
          const resource = resources[index]
          return (
            <g key={resource.id}>
              <rect
                className={styles.resourceNode}
                x={node.x - nodeWidth / 2}
                y={node.y - nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                rx={NODE_RADIUS}
              />
              <text
                className={styles.resourceName}
                x={node.x}
                y={node.y + PRIMARY_LINE_OFFSET}
              >
                {fitLabel(resource.name)}
              </text>
              <text
                className={styles.resourceDetails}
                x={node.x}
                y={node.y + SECONDARY_LINE_OFFSET}
              >
                {TEXT.resourceDetails(resource.type, resource.provider)}
              </text>
            </g>
          )
        })}
      </svg>

      {/* The SVG is one image to assistive technology; list members as text. */}
      <VisuallyHidden>
        <ul aria-label={TEXT.membersLabel(application.name)}>
          {resources.map((resource) => (
            <li key={resource.id}>
              {TEXT.memberSummary(
                resource.name,
                resource.type,
                resource.provider,
              )}
            </li>
          ))}
        </ul>
      </VisuallyHidden>
    </div>
  )
}
