import { MONITORING_ENDPOINT } from 'constants/ApiConstant'
import { LineChart } from 'sdk'

const SignalStrengthChart = () => {
  return (
    <LineChart
      unitValue='dBm'
      valueScaleWidth={100}
      title='Signal Strength'
      height={108}
      roundUp={2}
      colors={['#27DA68']}
      url={MONITORING_ENDPOINT}
      feature='wwan0'
      ticksPadding={20}
    />
  )
}

export default SignalStrengthChart
