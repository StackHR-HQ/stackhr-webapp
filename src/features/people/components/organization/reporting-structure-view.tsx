import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Card } from '../../../../components/ui/card'
import type { OrgTreeNode } from '../../lib/org-tree'

function ReportingNode({ node }: { node: OrgTreeNode }) {
  return (
    <li>
      <Link
        to={`/people/employees/${node.employee.id}`}
        className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-canvas"
      >
        <Avatar initials={node.employee.avatarInitials} size="sm" />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-ink">{node.employee.fullName}</span>
          <span className="block truncate text-xs text-muted">{node.employee.jobTitle}</span>
        </span>
      </Link>

      {node.children.length > 0 ? (
        <ul className="ml-4 space-y-1 border-l border-line pl-4">
          {node.children.map((child) => (
            <ReportingNode key={child.employee.id} node={child} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export function ReportingStructureView({ tree }: { tree: OrgTreeNode[] }) {
  return (
    <Card>
      <ul className="space-y-1">
        {tree.map((node) => (
          <ReportingNode key={node.employee.id} node={node} />
        ))}
      </ul>
    </Card>
  )
}
