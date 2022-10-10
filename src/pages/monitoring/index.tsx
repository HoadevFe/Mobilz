import { Grid } from '@mui/material'
import { Layout } from 'sdk'
import BandNumber from './components/BandNumber'
import CoreTempChart from './components/CoreTemp'
import DeviceDetail from './components/DeviceDetail'
import MonitoringHeader from './components/Header'
import NetworkUsageChart from './components/NetworkUsage'
import SignalStrengthChart from './components/SignalStrength'

export default function Monitoring() {
  return (
    <Layout rightHeader={<DeviceDetail />}>
      <MonitoringHeader />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <CoreTempChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <SignalStrengthChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <BandNumber />
        </Grid>
        <Grid item xs={12} lg={12}>
          <NetworkUsageChart />
        </Grid>
      </Grid>
    </Layout>
  )
}
