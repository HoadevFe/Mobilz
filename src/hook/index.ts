import { MutableRefObject, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { invokeRequest, RequestProps, useNotificationStore } from '../sdk'

export const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight])

  const updateSize = useDebouncedCallback(() => {
    setSize([window.innerWidth, window.innerHeight])
  }, 500)

  useEffect(() => {
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return size
}

interface Options {
  params?: string
  baseURL: string
}

export const useAPI = (options: RequestProps & { onShowLoading?: () => void } & { timeReload?: number }) => {
  const { onShowLoading, timeReload, ...rest } = options
  const dispatchNotification = useNotificationStore((store) => store.dispatchNotification)
  let intervalId: NodeJS.Timer

  useEffect(() => {
    if (rest.baseURL) {
      onShowLoading && onShowLoading()
      invokeRequest({ ...rest, onError: dispatchNotification })
      if (timeReload) {
        intervalId = setInterval(() => {
          invokeRequest({ ...rest, onError: dispatchNotification })
        }, timeReload)
      }
    }
    return () => clearInterval(intervalId)
  }, [rest.baseURL, timeReload])
}

export default function useOnScreen(ref: MutableRefObject<any>) {
  const [isIntersecting, setIntersecting] = useState(false)

  const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting))

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current)
      return () => observer.disconnect()
    }
  }, [ref])

  useEffect(() => {
    // User has switched back to the tab
    const onFocus = () => {
      const state = document.visibilityState
      if (state === 'visible') setIntersecting(true)
      else if (state === 'hidden') setIntersecting(false)
    }

    document.addEventListener('visibilitychange', onFocus)
    return () => {
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [])

  return isIntersecting
}
