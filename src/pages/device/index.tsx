import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DEVICE_ENDPOINT } from '../../constants/ApiConstant'
import { Column, Layout, ListView } from '../../sdk'
import { DateCell } from '../../shared-components'
import DeviceHeader from './Header'
import styles from './style.module.scss'

class DeviceModelLTE {
  @Column({
    title: 'Serial Number',
    render: ({ id, serialNumber, isLTE }) => (
      <Link replace className={styles.Link} to={`/monitoring?host=${serialNumber}&id=${id}&isLTE=${isLTE}`}>
        {serialNumber}
      </Link>
    )
  })
  serialNumber?: string

  @Column({ title: 'IP Address' })
  ipAddress?: string

  @Column({
    title: 'Created Date',
    render: ({ createdAt }) => <DateCell value={createdAt} />
  })
  createdAt?: Date

  @Column({
    title: 'Last update',
    render: ({ updatedAt }) => <DateCell value={updatedAt} />
  })
  updatedAt?: string

  @Column({ title: 'Country' })
  countryName?: string

  @Column({ title: 'Operator' })
  operator?: string

  @Column({ title: 'Cell Identity' })
  lteCellId?: string

  @Column({ title: 'Cell ID' })
  phyCellId?: string

  @Column({ title: 'Area Code' })
  areaCode?: string

  @Column({
    title: 'Status',
    render: ({ status }) => <FiberManualRecordIcon fontSize='small' color={status ? 'success' : 'inherit'} />
  })
  status?: boolean
}

class DeviceModelWifi {
  @Column({
    title: 'Serial Number',
    render: ({ serialNumber }) => (
      <Link className={styles.Link} to={`/monitoring?host=${serialNumber}`}>
        {serialNumber}
      </Link>
    )
  })
  serialNumber?: string

  @Column({ title: 'SSID' })
  ssid?: string

  @Column({ title: 'IP Address' })
  ipAddress?: string

  @Column({
    title: 'Created Date',
    render: ({ createdAt }) => <DateCell value={createdAt} />
  })
  createdAt?: Date

  @Column({
    title: 'Last update',
    render: ({ updatedAt }) => <DateCell value={updatedAt} />
  })
  updatedAt?: string

  @Column({
    title: 'Status',
    render: ({ status }) => <FiberManualRecordIcon fontSize='small' color={status ? 'success' : 'inherit'} />
  })
  status?: boolean
}

export default function DeviceManagement() {
  const [type, setType] = useState(new URLSearchParams(location.search).get('type') || 'LTE')
  const [status, setStatus] = useState(new URLSearchParams(location.search).get('status') || 'false')

  const onChange = (value: string) => {
    const queryParams = new URLSearchParams(location.search)
    if (value === 'true' || value === 'false') {
      queryParams.set('status', value)
      history.replaceState(null, '', '?' + queryParams.toString())
      setStatus(value)
    } else {
      queryParams.set('type', value)
      history.replaceState(null, '', '?' + queryParams.toString())
      setType(value)
    }
  }

  return (
    <Layout>
      <ListView
        title='List Devices'
        search
        model={type === 'LTE' ? DeviceModelLTE : DeviceModelWifi}
        baseURL={DEVICE_ENDPOINT}
        id='device'
        extraHeader={<DeviceHeader type={type} status={status} onChange={onChange} />}
      />
    </Layout>
  )
}
