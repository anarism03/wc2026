import { Skeleton } from 'antd'

interface LoadingSkeletonProps {
  rows?: number
  avatar?: boolean
}

export default function LoadingSkeleton({ rows = 4, avatar = false }: LoadingSkeletonProps) {
  return (
    <div className="p-6 w-full max-w-2xl">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="mb-4">
          <Skeleton active avatar={avatar && i === 0} paragraph={{ rows: 2 }} />
        </div>
      ))}
    </div>
  )
}
