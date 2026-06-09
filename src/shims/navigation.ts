import { useEffect, useState } from 'react'

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

export function usePathname() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const update = () => setPath(normalizePath(window.location.pathname))
    window.addEventListener('popstate', update)
    window.addEventListener('wc:navigate', update)
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener('wc:navigate', update)
    }
  }, [])

  return path
}
