import { BreakPoints } from '../../constants/AppConstant'
import { useAPI, useWindowSize } from '../../hook'
import { Data, useListViewStore } from '../store'
import { ListHeaderProps, Type } from './decorator'
import { ListHeader } from './ListHeader'
import { TableView } from './TableView'

export { Column } from './decorator'

type Props<T> = {
  model: Type<T>
  id: string
  baseURL?: string
}

export const ListView = <T extends object>(props: Props<T> & ListHeaderProps) => {
  const windowSize = useWindowSize()
  const onLoading = useListViewStore((store) => store.onLoading)
  const onData = useListViewStore((store) => store.onData)

  if (windowSize[0] <= BreakPoints.mobile) {
    // TODO render list as card view
    console.log('Mobile')
  } else if (windowSize[0] <= BreakPoints.tablet) {
    // TODO render as table view
    console.log('Tablet')
  } else {
    console.log('Laptop or Desktop')
  }

  const onShowLoading = () => onLoading(props.id)

  const onSuccess = (data: Data) => onData(props.id, data, props.baseURL)

  useAPI({ baseURL: (props.baseURL || '') + location.search, onShowLoading, onSuccess })

  return (
    <>
      <ListHeader {...props}></ListHeader>
      {props.model && <TableView {...props} pagination />}
    </>
  )
}
