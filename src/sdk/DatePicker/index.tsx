import { Grid, Tooltip, TooltipProps, Typography } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { DEFAULT_FORMATTER_SECOND_TIME, MONTH_IN_SECOND } from 'constants/AppConstant'
import dayjs, { Dayjs } from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { SetStateAction, useState } from 'react'
import { ContainerInputField, Flex, TextButton } from 'sdk'
import styles from './style.module.scss'

dayjs.extend(timezone)
dayjs.extend(utc)

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

const PatchTooltip = (props: TooltipProps) => {
  return (
    <Tooltip {...props}>
      <span>{props.children}</span>
    </Tooltip>
  )
}

export const DatePicker = (props: {
  setAnchorEl: React.Dispatch<SetStateAction<HTMLButtonElement | null>>
  handleSubmit: (start: Dayjs, stop: Dayjs) => void
  startDefaultUnix: number | null
  stopDefaultUnix: number | null
}) => {
  const { startDefaultUnix, stopDefaultUnix, handleSubmit, setAnchorEl } = props

  const [start, setStart] = useState<Dayjs>(dayjs(startDefaultUnix))
  const [stop, setStop] = useState<Dayjs>(dayjs(stopDefaultUnix))

  const handleSubmitTimeRange = () => {
    handleSubmit(start, stop)
    setAnchorEl(null)
  }

  const startDate = dayjs(start).tz(tz).format(DEFAULT_FORMATTER_SECOND_TIME)
  const endDate = dayjs(stop).tz(tz).format(DEFAULT_FORMATTER_SECOND_TIME)

  const isValidDate = dayjs(stop).diff(dayjs(start), 's') > MONTH_IN_SECOND || dayjs(stop).diff(dayjs(start), 's') < 0
  const isValidInput = (date: dayjs.Dayjs | null) => {
    if (!date) return false
    return isValidDate
  }
  const isValidSubmit = (date: dayjs.Dayjs | null) => {
    if (!dayjs(date).get('date')) return true
    return isValidDate
  }

  return (
    <div className={styles.Main}>
      <Typography>Absolute time range</Typography>
      <Flex className={styles.InputField}>
        <Grid item xs={12}>
          <DateTimePicker
            value={start}
            onChange={(newValue) => {
              setStart(dayjs(newValue))
            }}
            inputFormat={DEFAULT_FORMATTER_SECOND_TIME}
            closeOnSelect={true}
            views={['day', 'hours', 'minutes', 'seconds']}
            ampm={false}
            DialogProps={{ classes: { paper: styles.DateRangeMobile } }}
            PaperProps={{ className: styles.DateRangeBox, classes: { root: styles.DateRangeBoxStart } }}
            renderInput={(params) => (
              <PatchTooltip
                title='Please enter a past datetime or "now"'
                arrow
                open={isValidInput(start)}
                classes={{ tooltip: styles.TooltipError, arrow: styles.TooltipArrow }}>
                <ContainerInputField
                  {...params}
                  value={startDate}
                  label='From'
                  className={styles.DateRangePickerInput}
                  placeholder={DEFAULT_FORMATTER_SECOND_TIME}
                  error={isValidInput(start)}
                />
              </PatchTooltip>
            )}
          />
        </Grid>
      </Flex>
      <Flex className={styles.InputField}>
        <Grid item xs={12}>
          <DateTimePicker
            PaperProps={{ className: styles.DateRangeBox, classes: { root: styles.DateRangeBoxStop } }}
            DialogProps={{ classes: { paper: styles.DateRangeMobile } }}
            value={stop}
            onChange={(newValue) => {
              setStop(dayjs(newValue))
            }}
            inputFormat={DEFAULT_FORMATTER_SECOND_TIME}
            ampm={false}
            views={['day', 'hours', 'minutes', 'seconds']}
            closeOnSelect={true}
            renderInput={(params) => (
              <PatchTooltip
                title='Please enter a past datetime or "now"'
                arrow
                open={isValidInput(stop)}
                classes={{ tooltip: styles.TooltipError, arrow: styles.TooltipArrow }}>
                <ContainerInputField
                  {...params}
                  value={endDate}
                  label='To'
                  placeholder={DEFAULT_FORMATTER_SECOND_TIME}
                  className={styles.DateRangePickerInput}
                  error={isValidInput(stop)}
                />
              </PatchTooltip>
            )}
          />
        </Grid>
      </Flex>
      <TextButton
        className={styles.ButtonSettings}
        onClick={handleSubmitTimeRange}
        disabled={isValidSubmit(start) || isValidSubmit(stop)}>
        Apply time range
      </TextButton>
    </div>
  )
}
