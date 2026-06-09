import type { SWRConfiguration } from 'swr'

export const swrConfig: SWRConfiguration = {
  dedupingInterval: 30000,
  revalidateOnFocus: false,
  errorRetryCount: 2,
}

export const liveSwrConfig: SWRConfiguration = {
  ...swrConfig,
  refreshInterval: 30000,
}
