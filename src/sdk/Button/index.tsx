import { Button, ButtonProps, IconButton as MUIIconButton } from '@mui/material'
import clsx from 'clsx'
import styles from './style.module.scss'

export const PrimaryButton = (props: ButtonProps) => {
  return (
    <Button
      {...props}
      variant='contained'
      className={clsx(styles.BaseButton, styles.PrimaryButton, styles.Button, props.className)}
    />
  )
}

export const GhostButton = (props: ButtonProps) => {
  return (
    <Button
      {...props}
      variant='outlined'
      className={clsx(styles.BaseButton, styles.GhostButton, styles.Button, props.className)}
    />
  )
}

export const TextButton = (props: ButtonProps) => {
  return (
    <Button
      {...props}
      variant='outlined'
      className={clsx(styles.BaseButton, styles.TextButton, styles.Button, props.className)}
    />
  )
}

export const IconButton = (props: ButtonProps) => {
  return <MUIIconButton {...props} />
}
