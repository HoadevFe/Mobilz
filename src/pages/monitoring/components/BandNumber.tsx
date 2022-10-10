import { MONITORING_ENDPOINT } from 'constants/ApiConstant'
import { useLocation } from 'react-router-dom'
import { LineChart } from 'sdk'

const BandNumber = () => {
  const location = useLocation()
  const defaultValue = new URLSearchParams(location.search)
  const title = defaultValue.get('isLTE')?.toLowerCase() === 'true' ? 'Band' : 'Channel'
  return (
    <LineChart
      unitValue=''
      valueScaleWidth={40}
      title={title}
      height={108}
      colors={['#27DA68']}
      roundUp={1}
      url={MONITORING_ENDPOINT}
      feature='Band Number'
      ticksPadding={40}
    />
  )
}

export default BandNumber
