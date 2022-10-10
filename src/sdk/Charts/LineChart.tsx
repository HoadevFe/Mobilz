import { Box, CircularProgress, Grid, Skeleton, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import clsx from 'clsx'
import { DEFAULT_FORMATTER } from 'constants/AppConstant'
import dayjs from 'dayjs'
import useOnScreen from 'hook'
import { forwardRef, memo, useEffect, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useLocation } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import { ApiCore, onUpdateQuery } from '../ApiCore'
import { useMonitoringStore } from '../store/monitoring-store'
import styles from './style.module.scss'
import { handleTimeline, isRangeFiveMin } from './util'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export interface BaseChartProps {
  unitValue?: string
  valueScaleWidth?: number
  title?: string
  argumentCustomWidth?: number
  height: number
  colors?: string[]
  url: string
  name?: string
  borderColor?: string[]
  roundUp?: number
  feature?: string
  ticksPadding?: number
}

interface dataset {
  label: string
  data: unknown
  borderColor: string
  backgroundColor: string
  yAxisID: string
}

interface LineChartState {
  loading: boolean
  labels: string[]
  datasets: dataset[]
  isRefresh: boolean
  isEmpty: boolean
  timeRange: { start: number | string | null; stop: number | string | null }
  isShowPoint: boolean
}

export const updateChart = (chartRef: any, labels: any, datasets: any, prevTimeLine: any, timeLineHolder: any) => {
  if (chartRef.current) {
    if (prevTimeLine) prevTimeLine.current = ''
    if (timeLineHolder) timeLineHolder.current = []
    chartRef.current.data.labels = labels
    chartRef.current.data.datasets = datasets
    chartRef.current.update('none')
  }
}

export const LineChart = (props: BaseChartProps) => {
  const { interval, timeRange, host } = useMonitoringStore()
  const { title, height, colors = [], url, feature } = props
  const chartRef = useRef<{ data: { labels: string[]; datasets: unknown }; update: () => void } & ChartJS>()
  const patternRef = useRef()
  const prevTimeLine = useRef('')
  const timeLineHolder = useRef<string[]>([])
  const [state, setState] = useState<LineChartState>({
    loading: true,
    labels: [],
    datasets: [],
    isRefresh: false,
    isEmpty: false,
    timeRange: { start: null, stop: null },
    isShowPoint: false
  })
  const isVisible = useOnScreen(patternRef)

  async function doFetch() {
    setState((prev) => ({ ...prev, isRefresh: true }))

    const urlTimeRange = onUpdateQuery(url, { ...timeRange, name: feature, interval, host })
    try {
      const resp = await ApiCore.get(urlTimeRange)

      if (resp.data.length) {
        let datasets: dataset[] = []
        let isShowPoint = false
        const labels = resp.data[0].timeline
        resp.data.forEach((item: any, i: number) => {
          const dataChartItem = item.data.filter((value: unknown) => value !== null)
          if (dataChartItem.length !== 0 && dataChartItem.length <= 20) isShowPoint = true
          dataChartItem.length !== 0 &&
            datasets.push({
              label: item.name,
              data: item.data,
              borderColor: colors[i],
              backgroundColor: colors[i],
              yAxisID: 'y'
            })
        })
        setState({
          loading: false,
          labels,
          datasets,
          isRefresh: false,
          isEmpty: false,
          timeRange: timeRange,
          isShowPoint
        })
        updateChart(chartRef, labels, datasets, prevTimeLine, timeLineHolder)
      } else {
        setState({
          labels: [],
          datasets: [],
          isRefresh: false,
          loading: false,
          isEmpty: true,
          timeRange: { start: null, stop: null },
          isShowPoint: false
        })
      }
    } catch (err) {
      console.log('err', err)
    }
  }

  useEffect(() => {
    if (isVisible && host) {
      doFetch()
    } else {
      setState({ ...state, loading: false, isEmpty: true, isRefresh: false })
    }
  }, [url, isVisible, timeRange, interval, host])

  useEffect(() => {
    if (!state.loading && chartRef.current) {
      updateChart(chartRef, state.labels, state.datasets, prevTimeLine, timeLineHolder)
    }
  }, [url, state, timeRange])

  const updateLayoutChart = useDebouncedCallback(() => {
    updateChart(chartRef, state.labels, state.datasets, prevTimeLine, timeLineHolder)
  }, 500)

  useEffect(() => {
    window.addEventListener('resize', updateLayoutChart)
    return () => window.removeEventListener('resize', updateLayoutChart)
  }, [])

  return (
    <Paper className={styles.PaperChart}>
      <div ref={patternRef as any}>
        {state.loading ? (
          <Grid container spacing={2} className={clsx(styles.SkeletonLineRoot, styles.SkeletonRoot)}>
            <Box className={styles.SkeletonTitle}>
              <Skeleton />
            </Box>
            <Box className={styles.SkeletonChart} sx={{ height: height + 135 + 'px' }}>
              <Skeleton />
            </Box>
          </Grid>
        ) : (
          <Box className={styles.chartRoot}>
            <Box className={styles.chartHeader}>
              <Typography className={styles.TitleChart}>
                {title}
                {state.isRefresh && <CircularProgress className={styles.chartLoading} />}
              </Typography>
            </Box>
            {state.isEmpty ? (
              <Paper className={styles.chartRoot} sx={{ height: height + 105 }}>
                <Typography className={styles.DataEmpty} sx={{ lineHeight: height + 80 + 'px' }}>
                  No data
                </Typography>
              </Paper>
            ) : (
              <LineChartMemo
                ref={chartRef as any}
                {...props}
                timeLineHolder={timeLineHolder}
                prevTimeLine={prevTimeLine}
                state={state}
              />
            )}
          </Box>
        )}
      </div>
    </Paper>
  )
}

const LineChartMemo = memo(
  forwardRef<any, BaseChartProps | any>((props, ref) => {
    const { roundUp, unitValue, name, ticksPadding, state, timeLineHolder, prevTimeLine } = props
    const location = useLocation()
    const defaultValue = new URLSearchParams(location.search)
    const startTimeRange = defaultValue.get('start') || ''
    const stopTimeRange = defaultValue.get('stop') || ''

    const xTicks = function (value: unknown) {
      const defaultValue = ref as any
      if (defaultValue.current) {
        const date = dayjs(defaultValue.current.data.labels[value as number] as string)
        const prevDate = prevTimeLine.current ? dayjs(prevTimeLine.current) : undefined
        const timeline = handleTimeline(timeLineHolder.current, date, startTimeRange, stopTimeRange, prevDate)
        if (timeline) {
          timeLineHolder.current.push(timeline)
          if (!prevDate) prevTimeLine.current = defaultValue.current.data.labels[value as number]
        }
        return timeline
      }
      return ''
    }

    return (
      <Line
        ref={ref as any}
        className={styles.ChartRoot}
        options={{
          animation: false,
          responsive: true,
          spanGaps: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index' as const, intersect: false },
          plugins: {
            title: { display: false },
            legend: {
              position: 'bottom',
              align: 'start',
              labels: {
                boxWidth: 12,
                boxHeight: 3,
                color: '#fff',
                padding: 5
              }
            },
            tooltip: {
              position: 'nearest',
              backgroundColor: '#181b1f',
              titleSpacing: 3,
              padding: 20,
              footerAlign: 'right',
              mode: 'nearest',
              boxWidth: 13,
              boxHeight: 3,
              callbacks: {
                title: (context) => (context.length ? dayjs(context[0].label).format(DEFAULT_FORMATTER + ':ss') : ''),
                label: function (context) {
                  if (context.raw && context.dataset.label) {
                    const valueFormat = Number(context.raw).toFixed(roundUp)
                    return `${valueFormat} ${unitValue}`
                  }
                  return ''
                }
              }
            }
          },
          elements: {
            point: {
              radius: isRangeFiveMin(startTimeRange, stopTimeRange) || state.isShowPoint ? 2 : 0
            },
            line: { borderWidth: 1 }
          },
          scales: {
            x: {
              grid: {
                color: '#4B4C57',
                borderWidth: 1
              },
              ticks: {
                color: '#fff',
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0,
                callback: xTicks,
                source: 'auto',
                padding: 20
              }
            },
            y: {
              type: 'linear' as const,
              display: true,
              position: 'left' as const,
              grid: {
                color: '#4B4C57',
                borderWidth: 1,
                lineWidth: 1,
                drawTicks: false,
                borderColor: 'rgba(61, 61, 61, 0)'
              },
              ticks: {
                color: '#fff',
                autoSkip: true,
                autoSkipPadding: ticksPadding || 10,
                callback: function (this, value) {
                  return unitValue ? `${Math.round(+value * 100) / 100} ${unitValue}` : value
                }
              }
            }
          }
        }}
        data={{ labels: [], datasets: [{ data: [] }] }}
      />
    )
  }),
  () => true
)
