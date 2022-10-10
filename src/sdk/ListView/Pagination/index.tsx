import { TablePagination } from '@mui/material'
import clsx from 'clsx'
import { useState } from 'react'
import { useListViewStore } from 'sdk'
import styles from './style.module.scss'

type PaginationProps = {
  id: string
  count: number
}

export const Pagination = (props: Partial<PaginationProps>) => {
  const { id = '' } = props
  const [page, setPage] = useState(Number(new URLSearchParams(location.search).get('page') || 1) - 1)
  const [rowsPerPage, setRowsPerPage] = useState(Number(new URLSearchParams(location.search).get('size') || 10))
  const onPageChange = useListViewStore((store) => store.onPageChange)
  const onPageSizeChange = useListViewStore((store) => store.onPageSizeChange)
  const data = useListViewStore((store) => store.listViewMap?.get(id)?.data)

  const count = data?.totalRecords || 0

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const pageSize = parseInt(event.target.value, 10)
    onPageSizeChange(id, pageSize)
    setRowsPerPage(pageSize)
    setPage(0)
  }

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
    onPageChange(id, newPage + 1)
  }

  return (
    <TablePagination
      component='div'
      count={count}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      className={styles.Pagination}
      classes={{
        select: styles.Select,
        selectLabel: styles.Body2,
        displayedRows: clsx(styles.displayedRows, styles.Body2)
      }}
      nextIconButtonProps={{ classes: { disabled: styles.Disabled } }}
      backIconButtonProps={{ classes: { disabled: styles.Disabled } }}
    />
  )
}
