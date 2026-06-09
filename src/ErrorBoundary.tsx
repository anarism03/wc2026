import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from 'antd'
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons'
import Link from '@/src/shims/Link'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('WC2026 runtime error', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="surface-card w-full p-8 sm:p-10">
          <div className="mx-auto max-w-xl">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
              Something went wrong
            </div>
            <h1 className="font-display text-3xl font-extrabold" style={{ color: 'var(--text-main)' }}>
              Səhifə yenidən yüklənir
            </h1>
            <p className="mt-3 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
              Tətbiqdə gözlənilməz xəta baş verdi. Sizi ana səhifəyə yönləndiririk ki, sayt işlək qalsın.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/" className="no-underline">
                <Button type="primary" icon={<HomeOutlined />}>
                  Ana səhifə
                </Button>
              </Link>
              <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
                Yenidən yüklə
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
