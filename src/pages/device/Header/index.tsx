import { AccessTime } from '@mui/icons-material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { Box, Button, Grid, MenuItem, Popover, Select, Switch, Typography } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DEVICE_ENDPOINT } from 'constants/ApiConstant'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { handleDownload, useListViewStore } from 'sdk'
import { DatePicker } from 'sdk/DatePicker'
import styles from './style.module.scss'

const CategoryDevice = [
  { label: 'LTE', value: 'LTE' },
  { label: 'WIFI', value: 'WIFI' }
]
interface Props {
  type: string
  status: string
  onChange: (value: string) => void
}

const DeviceHeader = (props: Props) => {
  const { type, status, onChange } = props
  const onQuery = useListViewStore((store) => store.onQuery)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const location = useLocation()
  const defaultValue = new URLSearchParams(location.search)
  const [timeRange, setTimeRange] = useState({
    start: defaultValue.get('start'),
    stop: defaultValue.get('stop')
  })
  const startDefaultUnix = timeRange.start ? +timeRange.start : null
  const stopDefaultUnix = timeRange.stop ? +timeRange.stop : null

  const handleShowPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const onDownload = () => {
    handleDownload(
      `${DEVICE_ENDPOINT}/export` + window.location.search,
      `device-list-${dayjs().format('DDMMYY-HHmmss')}`
    )
  }

  const handleSubmitTimeRange = (start: Dayjs, stop: Dayjs) => {
    const getValue = (i: Dayjs) => {
      return `${dayjs(i).unix() * 1000}`
    }
    onQuery('device', {
      page: 1,
      start: getValue(start),
      stop: getValue(stop)
    })
    setTimeRange({ start: getValue(start), stop: getValue(stop) })
    setAnchorEl(null)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid item className={styles.SwitchRight}>
        <Typography variant='subtitle2' className={styles.labelStatus} color='#CCCEDA'>
          Online
        </Typography>
        <Switch
          className={styles.switch}
          defaultChecked={status === 'true'}
          onChange={(e) => onChange(String(e.target.checked))}
        />
      </Grid>
      <Select
        className={styles.BaseDropdown}
        value={type}
        onChange={(e) => onChange(e.target.value)}
        MenuProps={{
          className: styles.MenuPropsDropdown,
          MenuListProps: {
            className: styles.InputBasePaper
          }
        }}>
        {CategoryDevice.map((item) => {
          return <MenuItem value={item.value}>{item.label}</MenuItem>
        })}
      </Select>

      <Grid item className={styles.DropdownRight}>
        <Button onClick={handleShowPopover} className={styles.Button} startIcon={<AccessTime />}>
          Select time range
        </Button>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          classes={{ paper: styles.PopoverSelect, root: styles.PopoverRoot }}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          onClose={() => setAnchorEl(null)}>
          <Box className={styles.TimeRange}>
            <DatePicker
              setAnchorEl={setAnchorEl}
              handleSubmit={handleSubmitTimeRange}
              startDefaultUnix={startDefaultUnix}
              stopDefaultUnix={stopDefaultUnix}
            />
          </Box>
        </Popover>
      </Grid>
      <Button onClick={onDownload} className={styles.btnSubmit} variant='contained'>
        <FileDownloadIcon />
      </Button>
    </LocalizationProvider>
  )
}

export default DeviceHeader
