import {
  Card as MUICard,
  CardActions as MUICardActions,
  CardActionsProps,
  CardProps,
  IconButton,
  Menu,
  MenuItem as MUIMenuItem,
  MenuItemProps,
  Typography,
} from '@mui/material'
import clsx from 'clsx'
import { useState } from 'react'
import styles from './style.module.scss'

export type CustomCardActionsProps = {
  icon: React.ReactNode
}

export type CustomMenuItemProps = {
  label?: string
  icon?: React.ReactNode
  onPress?: React.MouseEventHandler<HTMLElement>
}

export const Card = (props: CardProps) => {
  const { className, children, ...rest } = props

  return (
    <MUICard {...rest} className={clsx(styles.Card, className)}>
      {children}
    </MUICard>
  )
}

export const CardActions = (props: CardActionsProps & CustomCardActionsProps) => {
  const { className, children, icon, ...rest } = props
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <MUICardActions {...rest} className={clsx(styles.CardActions, className)}>
      <IconButton className={`${!!anchorEl ? styles.Active : styles.Inactive}`} onClick={handleClick}>
        {icon}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        className={clsx(styles.Menu, className)}
        classes={{ paper: styles.MenuPaper }}>
        {children}
      </Menu>
    </MUICardActions>
  )
}

export const MenuItem = (props: MenuItemProps & CustomMenuItemProps) => {
  const { className, label, onPress, icon, ...rest } = props

  return (
    <MUIMenuItem className={clsx(styles.MenuItem, className)} onClick={onPress} {...rest}>
      <Typography className={clsx(styles.Subhead1, styles.Label)}>{label}</Typography>
      {icon}
    </MUIMenuItem>
  )
}
