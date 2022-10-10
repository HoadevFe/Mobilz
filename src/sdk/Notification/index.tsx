import { Close } from '@mui/icons-material'
import { Alert, AlertClasses, AlertProps, AlertTitle, IconButton, Snackbar } from '@mui/material'
import clsx from 'clsx'
import { SyntheticEvent, useState } from 'react'
import { useNotificationStore } from '../store'
import styles from './notification.module.scss'

interface CustomAlertProps {
  label?: string
}

const alertClasses: Partial<AlertClasses> = {
  icon: styles.AlertIcon,
  action: styles.AlertAction,
  message: styles.AlertMessage
}

const AlertBase = (props: AlertProps) => {
  const { classes, children, ...rest } = props
  const [open, setOpen] = useState(true)

  const handleClose = (_: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return

    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert
        {...rest}
        variant='outlined'
        classes={{ ...alertClasses, ...classes }}
        action={
          <IconButton size='small' onClick={handleClose}>
            <Close />
          </IconButton>
        }>
        {children}
      </Alert>
    </Snackbar>
  )
}

export const SuccessNotification = (props: AlertProps & CustomAlertProps) => {
  const { children, label, className, ...rest } = props
  return (
    <AlertBase
      {...rest}
      className={clsx(styles.AlertBase, styles.AlertSuccessRoot, styles.AlertBaseLabel, className)}
      severity='success'>
      <AlertTitle classes={{ root: styles.AlertContentLabel }}>{label}</AlertTitle>
      {children}
    </AlertBase>
  )
}

export const InfoNotification = (props: AlertProps & CustomAlertProps) => {
  const { children, label, className, ...rest } = props
  return (
    <AlertBase
      {...rest}
      className={clsx(styles.AlertBase, styles.AlertInfoRoot, styles.AlertBaseLabel, className)}
      severity='info'>
      <AlertTitle classes={{ root: styles.AlertContentLabel }}>{label}</AlertTitle>
      {children}
    </AlertBase>
  )
}

export const WarningNotification = (props: AlertProps & CustomAlertProps) => {
  const { children, label, className, ...rest } = props
  return (
    <AlertBase
      {...rest}
      className={clsx(styles.AlertBase, styles.AlertWarningRoot, styles.AlertBaseLabel, className)}
      severity='warning'>
      <AlertTitle classes={{ root: styles.AlertContentLabel }}>{label}</AlertTitle>
      {children}
    </AlertBase>
  )
}

export const ErrorNotification = (props: AlertProps & CustomAlertProps) => {
  const { children, label, className, ...rest } = props
  return (
    <AlertBase
      {...rest}
      className={clsx(styles.AlertBase, styles.AlertErrorRoot, styles.AlertBaseLabel, className)}
      severity='error'>
      <AlertTitle classes={{ root: styles.AlertContentLabel }}>{label}</AlertTitle>
      {children}
    </AlertBase>
  )
}

export const NotificationProvider = () => {
  const notification = useNotificationStore((store) => store.notification)

  if (notification) {
    if (notification.type === 'error')
      return <ErrorNotification label={notification.label}>{notification.description}</ErrorNotification>
    return <></>
  }

  return <></>
}
