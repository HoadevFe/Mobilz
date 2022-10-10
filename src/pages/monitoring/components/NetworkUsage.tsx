import { MONITORING_ENDPOINT } from 'constants/ApiConstant'
import { AreaChart } from 'sdk'

const NetworkUsageChart = () => {
  return (
    <AreaChart
      title='Network Usage'
      unitValue='kb/s'
      height={108}
      colors={[
        'rgba(81, 161, 255, 0.5)',
        'rgba(14, 38, 206, 0.6)',
        'rgba(40, 206, 14, 0.6)',
        'rgba(206, 14, 196, 0.6)',
        'rgba(206, 14, 14, 0.6)',
        'rgba(203, 206, 14, 0.6)'
      ]}
      borderColor={['#6a9ff7', '#0761f7', '#46eb25', '#e825eb', '#eb2525', '#ebe125']}
      url={MONITORING_ENDPOINT}
      feature='Network Usage'
    />
  )
}

export default NetworkUsageChart
