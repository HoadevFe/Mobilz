import dayjs, { ManipulateType } from 'dayjs'
import create from 'zustand'

type Params = {
  host?: string
  isLTE?: boolean
  interval?: boolean
  timeRange: { start: number | string; stop: number | string }
}

interface IStore {
  host: string
  isLTE: boolean
  interval?: boolean
  timeRange: { start: number | string; stop: number | string }
  dispatchParams: (params: Params) => void
}

const configTimeRange = (start: number | string | null, stop: number | string | null) => {
  const current = dayjs()
  if (start && stop) {
    if (!start.toString().match(/^[0-9]*$/g)) {
      const time = start.toString().replace(/[^0-9]/g, '')
      const unit = start.toString().split('').pop()
      return {
        start: current.add(-time, unit as ManipulateType).unix(),
        stop: current.unix()
      }
    } else {
      return { start, stop }
    }
  } else {
    return {
      start: current.add(-300, 's').unix(),
      stop: current.unix()
    }
  }
}

export const useMonitoringStore = create<IStore>((set) => {
  const defaultValue = new URLSearchParams(location.search)
  const interval = defaultValue.get('start') === null && defaultValue.get('stop') === null
  const defaultIsLTE = defaultValue.get('isLTE')?.toLowerCase() === 'true'
  return {
    host: defaultValue.get('host') || '',
    isLTE: defaultIsLTE,
    interval,
    timeRange: configTimeRange(defaultValue.get('start'), defaultValue.get('stop')),
    dispatchParams: (params: Params) => {
      set((state) => ({ ...state, ...params }))
    }
  }
})
