import { Grid, Tooltip, TooltipProps, Typography } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { DEFAULT_FORMATTER_SECOND_TIME, MONTH_IN_SECOND } from 'constants/AppConstant'
import dayjs, { Dayjs } from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { SetStateAction, useState } from 'react'
import { ContainerInputField, Flex, TextButton, useMonitoringStore } from 'sdk'
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

export const TimePicker = (props: { setAnchorEl: React.Dispatch<SetStateAction<HTMLButtonElement | null>> }) => {
  const { timeRange, dispatchParams, host } = useMonitoringStore()
  const startDefaultUnix = timeRange.start ? +timeRange.start * 1000 : Date.now()
  const stopDefaultUnix = timeRange.stop ? +timeRange.stop * 1000 : Date.now()

  const [start, setStart] = useState<Dayjs | null>(dayjs(startDefaultUnix))
  const [stop, setStop] = useState<Dayjs | null>(dayjs(stopDefaultUnix))

  const handleSubmitTimeRange = () => {
    if (start && stop) {
      dispatchParams({
        host,
        timeRange: { start: dayjs(start).unix(), stop: dayjs(stop).unix() },
        interval: false
      })
    }
    props.setAnchorEl(null)
  }

  const startDate = dayjs(start).tz(tz).format(DEFAULT_FORMATTER_SECOND_TIME)
  const endDate = dayjs(stop).tz(tz).format(DEFAULT_FORMATTER_SECOND_TIME)

  const isValidDate = dayjs(stop).diff(dayjs(start), 's') > MONTH_IN_SECOND || dayjs(stop).diff(dayjs(start), 's') < 0
  const isValidInput = (date: dayjs.Dayjs | null) => {
    if (!date) return false;
    return !dayjs(date).isValid() || isValidDate
  }

  return (
    <div className={styles.Main}>
      <Typography>Absolute time range</Typography>
      <Flex className={styles.InputField}>
        <Grid item xs={12}>
          <DateTimePicker
            value={start}
            onChange={(newValue) => {
              setStart(newValue)
            }}
            inputFormat={DEFAULT_FORMATTER_SECOND_TIME}
            closeOnSelect={true}
            views={["day", "hours", "minutes", "seconds"]}
            ampm={false}
            DialogProps={{ classes: { paper: styles.DateRangeMobile } }}
            PaperProps={{ className: styles.DateRangeBox, classes: { root: styles.DateRangeBoxStart } }}
            renderInput={(params) => (
              <PatchTooltip
                title='Please enter a past datetime or "now"'
                arrow
                open={isValidInput(start)}
                classes={{ tooltip: styles.TooltipError, arrow: styles.TooltipArrow }}
              >
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
              setStop(newValue)
            }}
            inputFormat={DEFAULT_FORMATTER_SECOND_TIME}
            ampm={false}
            views={["day", "hours", "minutes", "seconds"]}
            closeOnSelect={true}
            renderInput={(params) => (
              <PatchTooltip
                title='Please enter a past datetime or "now"'
                arrow
                open={isValidInput(stop)}
                classes={{ tooltip: styles.TooltipError, arrow: styles.TooltipArrow }}
              >
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
        disabled={isValidInput(start) || isValidInput(stop)}
      >
        Apply time range
      </TextButton>
    </div>
  )
}
