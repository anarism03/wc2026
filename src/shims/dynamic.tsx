import { createElement, lazy, Suspense } from 'react'
import type { ComponentType, ReactNode } from 'react'

type Loader<TProps extends object> = () => Promise<{ default: ComponentType<TProps> }>

interface DynamicOptions {
  loading?: () => ReactNode
  ssr?: boolean
}

export default function dynamic<TProps extends object>(loader: Loader<TProps>, options: DynamicOptions = {}) {
  const Component = lazy(loader) as unknown as ComponentType<TProps>

  return function DynamicComponent(props: TProps) {
    return (
      <Suspense fallback={options.loading ? options.loading() : null}>
        {createElement(Component, props)}
      </Suspense>
    )
  }
}
