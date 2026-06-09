import { Button, Result } from 'antd'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({ message = 'Xəta baş verdi', onRetry }: ErrorStateProps) {
  return (
    <Result
      status="error"
      title="Xəta"
      subTitle={message}
      extra={
        onRetry ? (
          <Button type="primary" onClick={onRetry}>
            Yenidən cəhd et
          </Button>
        ) : undefined
      }
    />
  )
}
