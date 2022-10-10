import { CircularProgress, Fade } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useListViewStore } from '../../store/list-store'
import styles from './style.module.scss'

export const TableRowLoading = (props: { id: string }) => {
  const { id } = props
  const isFetching = useListViewStore((store) => store.listViewMap?.get(id)?.isFetching)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (loaderRef.current) {
      if (isFetching) {
        loaderRef.current.classList.add(`${styles.Active}`)
      } else {
        loaderRef.current.classList.remove(`${styles.Active}`)
      }
    }
  }, [isFetching])

  return (
    <div className={styles.TableRowLoading} ref={loaderRef}>
      <Fade in={true} className={styles.Item}>
        <CircularProgress />
      </Fade>
    </div>
  )
}
