import { Dayjs } from 'dayjs'

type Time = string | number | null

const PC_SCREEN = 1820
export const LAPTOP_SCREEN = 1320

const FIVE_MIN_IN_SECOND = 5 * 60
const HOUR_IN_SECOND = 1 * 60 * 60
const THIRTEEN_HOUR_IN_SECOND = 13 * HOUR_IN_SECOND
const DAY_IN_SECOND = 24 * HOUR_IN_SECOND

const PC_TIMELINE = {
  status: 'pc',
  fiveMin: 30,
  fifteenMin: { line: 5, area: 1 },
  thirtyMin: { line: 5, area: 5 },
  oneHour: { line: 5, area: 5 },
  twoHour: { line: 15, area: 15 },
  twelveHour: { line: 1, area: 1 },
  day: { line: 2, area: 2 },
  twoDays: { line: 6, area: 4 },
  threeDays: { line: 8, area: 6 },
  fourDays: { line: 12, area: 8 },
  fiveDays: { line: 12, area: 12 },
  sixDays: { line: 0, area: 12 },
  week: { line: 0, area: 0 }
}

const LAPTOP_TIMELINE = {
  status: 'laptop',
  fifteenMin: { line: 5, area: 5 },
  thirtyMin: { line: 5, area: 5 },
  oneHour: { line: 10, area: 10 },
  twoHour: { line: 15, area: 15 },
  twelveHour: { line: 2, area: 2 },
  day: { line: 3, area: 3 },
  twoDays: { line: 8, area: 8 },
  threeDays: { line: 12, area: 12 },
  fourDays: { line: 0, area: 0 },
  fiveDays: { line: 0, area: 0 },
  sixDays: { line: 0, area: 0 },
  week: { line: 0, area: 0 }
}

const MOBILE_TIMELINE = {
  status: 'mobile',
  fifteenMin: { line: 5, area: 5 },
  thirtyMin: { line: 5, area: 5 },
  oneHour: { line: 10, area: 10 },
  twoHour: { line: 30, area: 60 },
  twelveHour: { line: 2, area: 2 },
  day: { line: 4, area: 4 },
  twoDays: { line: 0, area: 0 },
  threeDays: { line: 0, area: 0 },

  fourDays: { line: 0, area: 0 },
  fiveDays: { line: 0, area: 0 },
  sixDays: { line: 0, area: 0 },
  week: { line: 0, area: 0 }
}

export const isRangeFiveMin = (start: Time, stop: Time) => {
  if (start && stop) return +stop - +start <= FIVE_MIN_IN_SECOND
  return false
}

const arrangeTimeLine = (areaChart: boolean, timeLineHolder: string[], range: number, date: Dayjs, formatKey: any, prevDate?: Dayjs) => {
  //5p
  if (range <= FIVE_MIN_IN_SECOND) {
    if (formatKey.fiveMin) {
      return date.second() % 30 === 0 ? date.format('HH:mm:ss') : null
    }
    return date.second() === 0 ? date.format('HH:mm:ss') : null
  }
  //15p
  if (range > FIVE_MIN_IN_SECOND && range <= FIVE_MIN_IN_SECOND * 3) {
    if (areaChart) return date.minute() % formatKey.fifteenMin.area === 0 && date.second() === 0 ? date.format('HH:mm') : null
    return date.minute() % formatKey.fifteenMin.line === 0 && date.second() === 0 ? date.format('HH:mm') : null
  }
  //30p
  if (range > FIVE_MIN_IN_SECOND * 3 && range <= FIVE_MIN_IN_SECOND * 6) {
    if (areaChart) return date.minute() % formatKey.thirtyMin.area === 0 && date.second() === 0 ? date.format('HH:mm') : null
    return date.minute() % formatKey.thirtyMin.line === 0 && date.second() === 0 ? date.format('HH:mm') : null
  }
  //1hour
  if (range > FIVE_MIN_IN_SECOND * 6 && range <= HOUR_IN_SECOND) {
    if (areaChart) return date.minute() % formatKey.oneHour.area === 0 && date.second() === 0 ? date.format('HH:mm') : null
    return date.minute() % formatKey.oneHour.line === 0 && date.second() === 0 ? date.format('HH:mm') : null
  }
  //2hour
    if (range > HOUR_IN_SECOND && range <= HOUR_IN_SECOND * 2) {
      if (areaChart)
        return date.minute() % formatKey.twoHour.area === 0 && date.second() === 0 ? date.format('HH:mm') : null
      return date.minute() % formatKey.twoHour.line === 0 && date.second() === 0 ? date.format('HH:mm') : null
    }
  // 12hour
  if (range > HOUR_IN_SECOND * 2 && range <= THIRTEEN_HOUR_IN_SECOND) {
    if (areaChart) return date.hour() % formatKey.twelveHour.area === 0 && date.minute() === 0 && date.second() === 0 ? date.format('HH:mm') : null
    return date.hour() % formatKey.twelveHour.line === 0 && date.minute() === 0 && date.second() === 0 ? date.format('HH:mm') : null
  }
  // 1day
  if (range > THIRTEEN_HOUR_IN_SECOND && range <= DAY_IN_SECOND) {
    if (areaChart) return date.hour() % formatKey.day.area === 0 && date.minute() === 0 && date.second() === 0 ? date.format('HH:mm') : null
    return date.hour() % formatKey.day.line === 0 && date.minute() === 0 && date.second() === 0 ? date.format('HH:mm') : null
  }
  // 2day
  if (range > DAY_IN_SECOND && range <= 2 * DAY_IN_SECOND) {
    if (formatKey.fourDays.area) {
      if (areaChart) return date.hour() % formatKey.twoDays.area === 0 && date.minute() === 0 && date.second() === 0 ? date.format('MM/DD HH:mm') : null
      return date.hour() % formatKey.twoDays.line === 0 && date.minute() === 0 && date.second() === 0 ? date.format('MM/DD HH:mm') : null
    } else {
      return date.hour() === 0 && date.minute() === 0 ? date.format('MM/DD HH:mm') : null
    }
  } else {
    if (!Boolean(prevDate) && date.hour() === 0 && date.minute() === 0) {
      const number = window.innerWidth >= PC_SCREEN ? 10 : 7
      if (range > 2 * DAY_IN_SECOND && range <= number * DAY_IN_SECOND) return date.format('MM/DD HH:mm')
      return date.format('MM/DD')
    }
    const diffDay = date.diff(prevDate, 'days')
    const existInTimeline = timeLineHolder.includes(date.format('MM/DD'))
    if (range > 2 * DAY_IN_SECOND && range <= 3 * DAY_IN_SECOND) {
      if (areaChart) return date.hour() % formatKey.threeDays.area === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:mm') : null
      return date.hour() % formatKey.threeDays.line === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:mm') : null
    }
    if (formatKey.status === 'mobile' && range > 3 * DAY_IN_SECOND && range <= 30 * DAY_IN_SECOND) {
      return diffDay % 2 === 0 && date.hour() === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:ss') : null
    }
    if (range > 3 * DAY_IN_SECOND && range <= 4 * DAY_IN_SECOND) {
      if (formatKey.fourDays.area) {
        if (areaChart) return date.hour() % formatKey.fourDays.area === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:mm') : null
        return date.hour() % formatKey.fourDays.line === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:mm') : null
      } else {
        return date.hour() === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:mm') : null
      }
    }
    if (range > 4 * DAY_IN_SECOND && range <= 5 * DAY_IN_SECOND) {
      if (formatKey.fiveDays.area) {
        if (areaChart) return date.hour() % formatKey.fiveDays.area === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:mm') : null
        return date.hour() % formatKey.fiveDays.line === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:mm') : null
      } else {
        return date.hour() === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:mm') : null
      }
    }
    if (range > 5 * DAY_IN_SECOND && range <= 6 * DAY_IN_SECOND) {
     if (areaChart) {
       if (formatKey.sixDays.area) {
         return date.hour() % formatKey.sixDays.area === 0 && date.minute() === 0 && !existInTimeline
           ? date.format('MM/DD HH:mm')
           : null
       }
       return date.hour() === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:mm') : null
     } else {
       if (formatKey.sixDays.line) {
         return date.hour() % formatKey.sixDays.line === 0 && date.minute() === 0 && !existInTimeline
           ? date.format('MM/DD HH:mm')
           : null
       }
       return date.hour() === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:mm') : null
     }
    }
    if (range > 6 * DAY_IN_SECOND && range <= 7 * DAY_IN_SECOND) {
      if (areaChart) {
        if (formatKey.week.area) {
          return date.hour() % formatKey.week.area === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:mm') : null
        }
        return date.hour() === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:mm') : null
      } else {
        if (formatKey.week.line) {
          return date.hour() % formatKey.week.line === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:mm') : null
        }
        return date.hour() === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:mm') : null
      }
    }
    if (window.innerWidth >= PC_SCREEN && range > 7 * DAY_IN_SECOND && range <= 10 * DAY_IN_SECOND) {
      return diffDay % 1 === 0 && date.hour() === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD HH:mm') : null
    }
    if (range > 7 * DAY_IN_SECOND && range <= 25 * DAY_IN_SECOND) {
      return diffDay % 2 === 0 && date.hour() === 0 && date.minute() === 0 && !existInTimeline ? date.format('MM/DD') : null
    }
    if (range > 25 * DAY_IN_SECOND && range <= 30 * DAY_IN_SECOND) {
      return diffDay % 3 === 0 && date.hour() === 0 && !existInTimeline ? date.format('MM/DD') : null
    }
  }
}

export const handleTimeline = (
  timeLineHolder: string[],
  date: Dayjs,
  start: Time,
  stop: Time,
  prevDate?: Dayjs,
  areaChart = false) => {
  if (start && stop) {
    const range = +stop - +start
    if (window.innerWidth >= PC_SCREEN) {
      return arrangeTimeLine(areaChart, timeLineHolder, range, date, PC_TIMELINE, prevDate)
    } else if (window.innerWidth >= LAPTOP_SCREEN) {
      return arrangeTimeLine(areaChart, timeLineHolder, range, date, LAPTOP_TIMELINE, prevDate)
    } else {
      return arrangeTimeLine(areaChart, timeLineHolder, range, date, MOBILE_TIMELINE, prevDate)
    }
  }
}
