import { Card, Grid, Skeleton } from '@mui/material'
import { DASHBOARD_ENDPOINT } from 'constants/ApiConstant'
import { useEffect, useState } from 'react'
import { ApiCore, Layout } from 'sdk'
import CardView from './CardView'
import styles from './style.module.scss'

interface DashBoardData {
  LTE: { total: number; online: number }
  WIFI: { total: number; online: number }
}

const DashboardSkeleton = () => (
  <>
    <Grid item xs={12}>
      <h2>
        <Skeleton variant='text' width='5%' height='2.5rem' sx={{ backgroundColor: '#3d3d3d' }} />
      </h2>
    </Grid>
    <Grid className={styles.contentSkeleton}>
      <Card className={styles.boxSkeleton}>
        <Skeleton variant='text' width='80%' height='45%' className={styles.skeleton} />
        <Skeleton variant='rectangular' width='80%' height='40%' className={styles.skeleton} />
      </Card>
      <Card className={styles.boxSkeleton}>
        <Skeleton variant='text' width='80%' height='45%' className={styles.skeleton} />
        <Skeleton variant='rectangular' width='80%' height='40%' className={styles.skeleton} />
      </Card>
    </Grid>
    <Grid item xs={12}>
      <h2>
        <Skeleton variant='text' width='5%' height='2.5rem' sx={{ backgroundColor: '#3d3d3d' }} />
      </h2>
    </Grid>
    <Grid className={styles.contentSkeleton}>
      <Card className={styles.boxSkeleton}>
        <Skeleton variant='text' width='80%' height='45%' className={styles.skeleton} />
        <Skeleton variant='rectangular' width='80%' height='40%' className={styles.skeleton} />
      </Card>
      <Card className={styles.boxSkeleton}>
        <Skeleton variant='text' width='80%' height='45%' className={styles.skeleton} />
        <Skeleton variant='rectangular' width='80%' height='40%' className={styles.skeleton} />
      </Card>
    </Grid>
  </>
)
export default function Dashboard() {
  const [dataDashboard, setDataDashboard] = useState<DashBoardData>()

  useEffect(() => {
    const fetchApi = async () => {
      const resp = await ApiCore.get(DASHBOARD_ENDPOINT)
      setDataDashboard(resp.data)
    }
    fetchApi()
  }, [])

  return (
    <Layout>
      {dataDashboard ? (
        <Grid className={styles.GridContainer} container spacing={2}>
          <CardView title='LTE' data={dataDashboard.LTE} url={'/devices?type=LTE'} />
          <CardView title='Wi-Fi' data={dataDashboard.WIFI} url={'/devices?type=WIFI'} />
        </Grid>
      ) : (
        <DashboardSkeleton />
      )}
    </Layout>
  )
}
