import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import type { OrgTreeNode } from '../../lib/org-tree'

function OrgChartCard({ node }: { node: OrgTreeNode }) {
  return (
    <Link
      to={`/people/employees/${node.employee.id}`}
      className="flex min-w-[168px] flex-col items-center gap-1.5 rounded-panel border border-line bg-surface px-3 py-3 text-center shadow-panel transition-colors hover:bg-surface-2"
    >
      <Avatar initials={node.employee.avatarInitials} size="sm" />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-ink">{node.employee.fullName}</span>
        <span className="block truncate text-xs text-muted">{node.employee.jobTitle}</span>
      </span>
    </Link>
  )
}

function OrgChartNode({ node }: { node: OrgTreeNode }) {
  return (
    <div className="flex flex-col items-center">
      <OrgChartCard node={node} />

      {node.children.length > 0 ? (
        <>
          <div className="h-6 w-px bg-line" />
          <div className="flex border-t border-line pt-6">
            {node.children.map((child) => (
              <div key={child.employee.id} className="flex flex-col items-center px-4">
                <div className="-mt-6 mb-6 h-6 w-px bg-line" />
                <OrgChartNode node={child} />
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

export function OrgChartView({ tree }: { tree: OrgTreeNode[] }) {
  return (
    <div className="overflow-x-auto rounded-panel border border-line bg-canvas p-8">
      <div className="flex w-fit min-w-full justify-center gap-12">
        {tree.map((node) => (
          <OrgChartNode key={node.employee.id} node={node} />
        ))}
      </div>
    </div>
  )
}
