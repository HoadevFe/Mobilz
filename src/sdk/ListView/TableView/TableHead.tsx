import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { Grid, TableCell, TableHead as MUITableHead, TableRow, TableSortLabel } from '@mui/material'
import clsx from 'clsx'
import { useListViewStore } from '../../store/list-store'
import { BaseOptions } from '../decorator'
import styles from './style.module.scss'

type Props = {
  id: string
  columns: BaseOptions[]
}
export const TableHead = (props: Props) => {
  const { columns, id } = props
  const onColumnSort = useListViewStore((store) => store.onColumnSort)
  const columnSort = useListViewStore((store) => store.listViewMap?.get(id)?.columnSort)

  return (
    <MUITableHead className={styles.TableHeader}>
      <TableRow className={styles.TableRow}>
        {columns.map((col) => (
          <TableCell key={col.key} className={clsx(styles.Subhead2, styles.TableCell)}>
            <Grid className={styles.Item}>
              {col.title}
              {col.sort && (
                <TableSortLabel
                  onClick={() => {
                    onColumnSort(id, col.key || '')
                  }}
                  IconComponent={() => (
                    <Grid className={styles.SortIcon}>
                      <ArrowDropUp
                        className={clsx(styles.Icon, `${columnSort?.get(col.key || '') === 'asc' && styles.Active}`)}
                      />
                      <ArrowDropDown className={`${columnSort?.get(col.key || '') === 'desc' && styles.Active}`} />
                    </Grid>
                  )}
                />
              )}
            </Grid>
          </TableCell>
        ))}
      </TableRow>
    </MUITableHead>
  )
}
