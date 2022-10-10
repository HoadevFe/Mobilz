import dayjs from 'dayjs'
import { Flex, FlexItem } from '../sdk'

export const DateCell = ({ value }: { value: Date | string | null }) => {
  if (!value) return <></>

  const date = dayjs(value)
  return (
    <Flex direction={'column'}>
      <FlexItem>{date.format('MMM DD, YYYY')}</FlexItem>
      <FlexItem>{date.format('HH:mm A')}</FlexItem>
    </Flex>
  )
}
