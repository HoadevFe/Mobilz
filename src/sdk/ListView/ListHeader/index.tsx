import { Search as IconSearch } from '@mui/icons-material'
import { Grid, Typography } from '@mui/material'
import { ChangeEvent } from 'react'
import { ContainerInputField } from 'sdk'
import { useDebouncedCallback } from 'use-debounce'
import { useListViewStore } from '../../store/list-store'
import { ListHeaderProps } from '../decorator'
import styles from './style.module.scss'

export const Search = (props: ListHeaderProps) => {
  const onSearch = useListViewStore((store) => store.onSearch)

  const onChangeValue = useDebouncedCallback((evt: ChangeEvent<HTMLInputElement>) => {
    onSearch(props.id, evt.target.value)
  }, 300)

  return (
    <ContainerInputField
      placeholder='Search'
      className={styles.Search}
      onChange={onChangeValue}
      InputProps={{
        startAdornment: <IconSearch />
      }}
    />
  )
}

export const ListHeader = (props: ListHeaderProps) => {
  const { title, search, extraHeader } = props

  return (
    <Grid container className={styles.ListHeader}>
      <Grid item xs={3}>
        <Typography className={styles.Subhead1}>{title}</Typography>
      </Grid>
      <Grid item xs={9} className={styles.Item}>
        {search && <Search {...props} />}
        {extraHeader}
      </Grid>
    </Grid>
  )
}
