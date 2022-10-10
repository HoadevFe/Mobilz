import { AlertColor } from '@mui/material'
import create from 'zustand'

export type DispatchNotification = (type?: AlertColor, label?: string, description?: string) => void

interface Notification {
  notification?: {
    type?: AlertColor
    label?: string
    description?: string
  }
  dispatchNotification: DispatchNotification
}

export const useNotificationStore = create<Notification>((set) => {
  return {
    dispatchNotification: (type?: AlertColor, label?: string, description?: string) => {
      set({ notification: { type, label, description } })
      setTimeout(() => set({ notification: undefined }), 5000)
    }
  }
})
