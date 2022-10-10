import { Table } from '@mui/material'
import { useMemo } from 'react'
import { getMetadataColumns, Type } from '../decorator'
import { Pagination } from '../Pagination'
import { TableRowLoading } from '../TableRowLoading'
import styles from './style.module.scss'
import { TableHead } from './TableHead'
import { TableRow } from './TableRow'

export interface TableProps<T extends object = any> {
  model: Type<T>
  id: string
  /** Base URL to fetch data. */
  baseURL?: string
  pagination?: boolean
  checkAll?: boolean
}

export const TableView = (props: TableProps) => {
  const { id, model, baseURL, pagination, checkAll } = props

  const columns = useMemo(() => getMetadataColumns({ key: model.name }), [model.name])

  return (
    <div className={styles.Container}>
      <Table>
        <TableHead id={id} columns={columns} />
        <TableRow id={id} columns={columns} />
      </Table>
      {pagination && <Pagination id={id} />}
      <TableRowLoading id={id} />
    </div>
  )
}
