import {
  Box,
  CircularProgress,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import Paper from '@mui/material/Paper'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  ScriptableContext,
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
import { BaseChartProps, updateChart } from './LineChart'
import styles from './style.module.scss'
import { handleTimeline } from './util'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

function formatBytes(bytes: number) {
  const units = ['b', 'kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb']
  if (bytes === 0) return '0 b'

  if (bytes) {
    let l = 0
    let n = parseInt(bytes.toString(), 10) as number
    let k = 1000

    while (n >= k && ++l) {
      n = n / k
    }
    return n.toFixed(n < 10 && l > 0 ? 2 : 0) + ' ' + units[l]
  }
  return null
}

interface ChartState {
  loading: boolean
  labels: string[]
  datasets: { data: [] }[]
  tableData: []
  isRefresh: boolean
  isEmpty: boolean
  timeRange: { start: number | string | null; stop: number | string | null }
}

export const AreaChart = (props: BaseChartProps) => {
  const { interval, timeRange, host } = useMonitoringStore()
  const { title, height, colors = [], url, borderColor, feature } = props
  const chartRef = useRef<{ data: { labels: unknown[]; datasets: unknown }; update: () => void }>()
  const patternRef = useRef()
  const prevTimeLine = useRef('')
  const timeLineHolder = useRef<string[]>([])
  const [state, setState] = useState<ChartState>({
    loading: true,
    labels: [],
    datasets: [{ data: [] }],
    tableData: [],
    isRefresh: false,
    isEmpty: false,
    timeRange: { start: null, stop: null }
  })
  const isVisible = useOnScreen(patternRef)

  async function doFetch() {
    setState((prev) => ({ ...prev, isRefresh: true }))
    const urlTimeRange = onUpdateQuery(url, { ...timeRange, name: feature, interval })
    try {
      const resp = await ApiCore.get(urlTimeRange)
      if (resp.data.length && resp.data[0].data.length) {
        const labels = resp.data[0].timeline

        const datasets = resp.data.map((item: any, i: number) => {
          return {
            fill: true,
            label: item.name,
            data: item.data,
            detail: item.detail,
            borderColor: borderColor ? borderColor[i] : colors[i],
            backgroundColor: (context: ScriptableContext<'line'>) => {
              const ctx = context.chart.ctx
              const gradient = ctx.createLinearGradient(0, 0, 0, 350)
              gradient.addColorStop(0, colors[i])
              gradient.addColorStop(1, 'rgba(14,38,206,0)')
              return gradient
            },
            yAxisID: 'y'
          }
        })

        const tableData = resp.data.map((item: any) => ({ name: item.name, ...item.tableData }))

        setState({
          loading: false,
          labels,
          datasets,
          tableData,
          isRefresh: false,
          isEmpty: false,
          timeRange: timeRange
        })
        updateChart(chartRef, labels, datasets, prevTimeLine, timeLineHolder)
      } else {
        setState({
          labels: [],
          datasets: [{ data: [] }],
          isRefresh: false,
          loading: false,
          isEmpty: true,
          tableData: [],
          timeRange: { start: null, stop: null }
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
  }, [timeRange, url, state])

  const updateLayoutChart = useDebouncedCallback(() => {
    updateChart(chartRef, state.labels, state.datasets, prevTimeLine, timeLineHolder)
  }, 500)

  useEffect(() => {
    window.addEventListener('resize', updateLayoutChart)
    return () => window.removeEventListener('resize', updateLayoutChart)
  }, [])

  return (
    <Paper className={clsx(styles.PaperChart, styles.AreaChart, styles.AreaChartRoot)}>
      <div ref={patternRef as any}>
        {state.loading ? (
          <Grid container spacing={2} className={clsx(styles.SkeletonChartNetWork, styles.SkeletonRoot)}>
            <Box className={styles.SkeletonTitle}>
              <Skeleton />
            </Box>
            <Box className={styles.SkeletonChartContent}>
              <Box className={styles.SkeletonChart} sx={{ height: height + 155 + 'px' }}>
                <Skeleton />
              </Box>
              <Box className={styles.SkeletonTable} sx={{ height: height + 155 + 'px' }}>
                <Skeleton />
              </Box>
            </Box>
          </Grid>
        ) : (
          <Grid className={styles.container} container spacing={2}>
            <Typography className={styles.TitleChart} sx={{ textAlign: 'center' }}>
              {title}
            </Typography>
            {state.isRefresh && <CircularProgress className={styles.chartLoading} />}
            {state.isEmpty ? (
              <>
                <Paper className={styles.chartRoot} sx={{ height: height + 105 }}>
                  <Typography className={styles.DataEmpty} sx={{ lineHeight: height + 105 + 'px' }}>
                    Data is missing a number field
                  </Typography>
                </Paper>
              </>
            ) : (
              <Grid container spacing={2} sx={{ display: 'flex' }}>
                <Grid item xs={12} lg={7}>
                  <Box className={clsx(styles.chartRoot)}>
                    <AreaChartMemo
                      ref={chartRef as any}
                      timeLineHolder={timeLineHolder}
                      prevTimeLine={prevTimeLine}
                      state={state}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} lg={5}>
                  <TableContainer component={Paper} className={styles.TableChart}>
                    <Table aria-label='caption table'>
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell align='right' className={styles.TableHeadCell}>
                            Mean
                          </TableCell>
                          <TableCell align='right' className={styles.TableHeadCell}>
                            Last*
                          </TableCell>
                          <TableCell align='right' className={styles.TableHeadCell}>
                            Max
                          </TableCell>
                          <TableCell align='right' className={styles.TableHeadCell}>
                            Min
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {state.tableData.length > 1 &&
                          state.tableData.map((item: any, i: number) => (
                            <TableRow key={item.name}>
                              <TableCell
                                component='th'
                                scope='row'
                                className={clsx(styles.TableCell, styles.TableCellMarket)}
                                sx={{ width: '60%' }}>
                                <Box
                                  className={clsx(styles.marketChart, item.name === styles.chart2)}
                                  sx={{ background: borderColor && borderColor[i] }}
                                />{' '}
                                {item.name}
                              </TableCell>
                              <TableCell align='right' className={styles.TableCell} sx={{ width: '10%' }}>
                                {formatBytes(item?.mean as number)}/s
                              </TableCell>
                              <TableCell align='right' className={styles.TableCell} sx={{ width: '10%' }}>
                                {formatBytes(item?.last as number)}/s
                              </TableCell>
                              <TableCell align='right' className={styles.TableCell} sx={{ width: '10%' }}>
                                {formatBytes(item?.max as number)}/s
                              </TableCell>
                              <TableCell align='right' className={styles.TableCell} sx={{ width: '10%' }}>
                                {formatBytes(item?.min as number)}/s
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
      </div>
    </Paper>
  )
}
const AreaChartMemo = memo(
  forwardRef<any, any>((props, ref) => {
    const { state, timeLineHolder, prevTimeLine } = props
    const location = useLocation()
    const defaultValue = new URLSearchParams(location.search)
    const startTimeRange = defaultValue.get('start') || ''
    const stopTimeRange = defaultValue.get('stop') || ''

    const xTicks = function (value: unknown) {
      const defaultValue = ref as any
      if (defaultValue.current) {
        const date = dayjs(defaultValue.current.data.labels[value as number] as string)
        const prevDate = prevTimeLine.current ? dayjs(prevTimeLine.current) : undefined
        const timeline = handleTimeline(timeLineHolder.current, date, startTimeRange, stopTimeRange, prevDate, true)
        if (timeline) {
          timeLineHolder.current.push(timeline)
          if (!prevDate) prevTimeLine.current = state.labels[value as number]
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
          maintainAspectRatio: false,
          interaction: { mode: 'index' as const, intersect: false },
          spanGaps: true,
          plugins: {
            title: { display: false },
            legend: {
              display: false,
              position: 'top',
              align: 'end',
              labels: {
                boxWidth: 12,
                boxHeight: 12,
                color: '#fff',
                padding: 50
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
                  const dataset = context.dataset as unknown as { detail: string; label: string }
                  const detailName = dataset.detail || dataset.label
                  if (context.formattedValue && detailName) {
                    return `${detailName} ${formatBytes(context.raw as number)}/s`
                  }
                  return ''
                }
              }
            }
          },
          elements: { point: { radius: 0 }, line: { borderWidth: 1 } },
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
                callback: xTicks
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
                autoSkipPadding: 25,
                callback: function (value) {
                  return `${formatBytes(value as number)?.replace('.00', '')}/s`
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
