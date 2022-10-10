import { AccessTime } from '@mui/icons-material'
import { Autocomplete, Box, Grid, MenuItem } from '@mui/material'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import clsx from 'clsx'
import { MONITORING_HOSTNAMES_ENDPOINT } from 'constants/ApiConstant'
import { DEFAULT_FORMATTER_SECOND_TIME } from 'constants/AppConstant'
import dayjs from 'dayjs'
import { useAPI } from 'hook'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ContainerInputField, onUpdateQuery, useMonitoringStore } from 'sdk'
import styles from '../style.module.scss'
import { TimePicker } from '../TimePicker'

const timers = [
  { label: 'Last 5 minutes', value: 300 },
  { label: 'Last 15 minutes', value: 900 },
  { label: 'Last 30 minutes', value: 1800 },
  { label: 'Last 1 hour', value: 3600 },
  { label: 'Last 12 hours', value: 43200 },
  { label: 'Last 24 hours', value: 86400 }
]

const MonitoringHeader = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const defaultValue = new URLSearchParams(location.search)
  const {
    dispatchParams,
    host = defaultValue.get('host') || '',
    isLTE = defaultValue.get('isLTE') || false,
    timeRange,
    interval
  } = useMonitoringStore()
  const intervalTimeRange = dayjs(+timeRange.stop).diff(+timeRange.start)
  const timeRangeFormat = `${dayjs(Number(timeRange.start) * 1000).format(DEFAULT_FORMATTER_SECOND_TIME)} to ${dayjs(
    Number(timeRange.stop) * 1000
  ).format(DEFAULT_FORMATTER_SECOND_TIME)}`

  const [state, setState] = useState({
    host: defaultValue.get('host') || '',
    isLTE: defaultValue.get('isLTE') || false,
    interval: timers.findIndex((x) => x.value === intervalTimeRange),
    id: defaultValue.get('id') || ''
  })
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [hostName, setHostName] = useState<{ value: string; isLTE: boolean; id: string }[]>([])
  const timeRangeName = useRef<{ label: string | undefined }>({ label: timeRangeFormat })
  const timerRef = useRef<number>(dayjs(+timeRange.stop).diff(+timeRange.start))

  timeRangeName.current.label = timers
    .map((timer) => (intervalTimeRange === timer.value ? timer.label : ''))
    .find((ele) => ele)

  const handleChangeInterval = (idx: number) => {
    const value = timers[idx].value
    timerRef.current = value
    setState((prev) => ({ ...prev, interval: idx }))
    const now = dayjs()
    dispatchParams({
      host: state.host,
      isLTE: state.isLTE as boolean,
      interval: true,
      timeRange: {
        start: now.subtract(Number(value), 's').unix(),
        stop: now.unix()
      }
    })
    setAnchorEl(null)
  }

  const handleChangeHost = (_: React.SyntheticEvent, host: string) => {
    const { id = '', isLTE = false, value = '' } = hostName.find((i) => i.value === host) || {}
    setState((prev) => ({ ...prev, host: value, isLTE, id }))
    dispatchParams({ host: value, isLTE, timeRange })
  }

  useEffect(() => {
    const search = new URLSearchParams(location.search)
    const host = search.get('host')
    const isLTE = search.get('isLTE')?.toLowerCase() === 'true'
    if (host) {
      dispatchParams({ host, isLTE, timeRange })
    }
  }, [location.search])

  useEffect(() => {
    if (state.host || timeRange) {
      const url = onUpdateQuery(location.pathname, {
        host: state.host,
        isLTE: state.isLTE,
        id: state.id,
        start: timeRange.start,
        stop: timeRange.stop
      })

      navigate(url)
    }
    let intervalTimer: NodeJS.Timer
    if (interval) {
      intervalTimer = setInterval(() => {
        const now = dayjs()
        dispatchParams({
          timeRange: {
            start: now.subtract(timerRef.current, 's').unix(),
            stop: now.unix()
          }
        })
      }, 5000)
    }
    return () => clearInterval(intervalTimer)
  }, [state, timeRange, host, isLTE, interval])

  const handleShowPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  useAPI({
    baseURL: MONITORING_HOSTNAMES_ENDPOINT,
    onSuccess: (data) => {
      setHostName(data)
    }
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container className={styles.MonitoringHeader}>
        <Grid item className={styles.digitOption}>
          <Box className={styles.DigitChart}>
            <p>Host</p>
          </Box>
          <Autocomplete
            options={hostName?.map((item) => item.value)}
            className={styles.InputAutoComplete}
            freeSolo={hostName.length === 0}
            value={state.host}
            disableClearable
            clearOnBlur={false}
            disabled={hostName.length === 0}
            onChange={handleChangeHost}
            renderInput={(params) => (
              <ContainerInputField
                {...params}
                variant='outlined'
                className={styles.ContainerInputField}
                placeholder='Enter variable value'
                classes={{ root: styles.InputBaseRoot }}
              />
            )}
            classes={{
              listbox: styles.AutocompletePopupListbox,
              paper: styles.AutocompletePopupPaper,
              popper: styles.AutocompletePopup,
              option: styles.AutocompleteInputRoot,
              noOptions: styles.AutocompleteNoOption
            }}
          />
        </Grid>
        <Grid item className={styles.DropdownRight}>
          <Button onClick={handleShowPopover} className={styles.Button} startIcon={<AccessTime />}>
            {timeRangeName.current.label || timeRangeFormat}
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
            {timers.map((time, idx) => (
              <MenuItem
                value={time.value}
                key={time.value}
                classes={{
                  root: clsx(
                    styles.MenuItem,
                    state.interval === idx && timeRangeName.current.label && styles.MenuItemActive
                  )
                }}
                onClick={() => handleChangeInterval(idx)}>
                {time.label}
              </MenuItem>
            ))}
            {Boolean(anchorEl) && (
              <Box className={styles.TimeRange}>
                <TimePicker setAnchorEl={setAnchorEl} />
              </Box>
            )}
          </Popover>
        </Grid>
      </Grid>
    </LocalizationProvider>
  )
}

export default MonitoringHeader
