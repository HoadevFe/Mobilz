import { DeviceCell } from 'pages/device/DeviceInfo'
import { useLocation } from 'react-router-dom'

export default function DeviceDetail() {
  const location = useLocation()
  const defaultValue = new URLSearchParams(location.search)
  const id = defaultValue.get('id')
  const isLTE = defaultValue.get('isLTE')?.toLowerCase() === 'true'

  if (id && isLTE) return <DeviceCell deviceId={id} />
  return <></>
}
