import { MONITORING_ENDPOINT } from 'constants/ApiConstant'
import { LineChart } from 'sdk'

const CoreTempChart = () => {
  return (
    <LineChart
      unitValue='°C'
      valueScaleWidth={40}
      title='Core Temp'
      height={108}
      colors={['#27DA68', '#F7BE15']}
      name='sensors'
      roundUp={1}
      url={MONITORING_ENDPOINT}
      feature='coretemp'
      ticksPadding={30}
    />
  )
}

export default CoreTempChart
