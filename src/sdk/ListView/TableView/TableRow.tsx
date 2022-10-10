import { TableBody, TableCell as MUITableCell, TableRow as MUITableRow } from '@mui/material'
import { ReactNode } from 'react'
import { useListViewStore } from '../../store'
import { BaseOptions } from '../decorator'
import styles from './style.module.scss'

type Props = { id: string; columns: BaseOptions[] }

export const TableRow = (props: Props) => {
  const { columns, id } = props
  const data = useListViewStore((store) => store.listViewMap?.get(id)?.data)

  if (!data) return <></>

  return (
    <TableBody className={styles.TableBody}>
      {data.data?.map((record, idx) => (
        <MUITableRow key={idx} className={styles.TableRow}>
          {TableCell(columns, record as Record<string, unknown>, idx)}
        </MUITableRow>
      ))}
    </TableBody>
  )
}

const TableCell = (columns: BaseOptions[], record: Record<string, unknown>, rowIdx: number) => {
  return columns.map(({ key = '' }, idx) => (
    <MUITableCell key={`${key}-${idx}`} className={styles.Body2} classes={{ root: styles.TableCell }}>
      {columns[idx].render ? columns[idx].render?.(record, rowIdx) : (record[key] as ReactNode)}
    </MUITableCell>
  ))
}
