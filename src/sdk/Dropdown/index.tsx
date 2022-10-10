import { KeyboardArrowDownRounded } from '@mui/icons-material'
import { Grid, Select, SelectProps, Typography } from '@mui/material'
import clsx from 'clsx'
import styles from './style.module.scss'

const InputClasses = {
  root: styles.Button,
  disabled: styles.InputDisabled,
  iconOpen: styles.IconOpen
}

type LabelProps = {
  flexDirection?: 'row' | 'column'
}

export const BaseDropdown = (props: SelectProps & LabelProps) => {
  const { className, label, defaultOpen, inputProps, flexDirection, children, value, onChange, ...rest } = props

  return (
    <Grid display='flex' flexDirection={flexDirection}>
      {label && (
        <Grid item display='flex' alignItems={'center'}>
          <Typography className={clsx(styles.Caption, styles.Text)}>{label}</Typography>
        </Grid>
      )}
      <Grid item>
        <Select
          className={clsx(styles.BaseDropdown, className)}
          value={value}
          onChange={onChange}
          inputProps={{
            classes: { ...InputClasses },
            ...inputProps
          }}
          IconComponent={KeyboardArrowDownRounded}
          {...rest}>
          {children}
        </Select>
      </Grid>
    </Grid>
  )
}

export const DropdownContained = (props: SelectProps & LabelProps) => {
  const { className, classes, children, ...rest } = props

  return (
    <BaseDropdown
      {...rest}
      variant='outlined'
      flexDirection='column'
      className={clsx(styles.DropdownContained, className)}
      classes={{
        outlined: styles.Outlined,
        ...classes
      }}>
      {children}
    </BaseDropdown>
  )
}

export const DropdownLine = (props: SelectProps & LabelProps) => {
  const { className, children, ...rest } = props

  return (
    <BaseDropdown {...rest} variant='standard' className={clsx(styles.DropdownLine, className)}>
      {children}
    </BaseDropdown>
  )
}
