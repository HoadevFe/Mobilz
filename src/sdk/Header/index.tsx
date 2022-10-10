import { Avatar, Box, Button, MenuItem, Popover, Typography } from '@mui/material'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { removeCookie } from 'sdk/util'
import { HeaderProps } from '../Layout'
import styles from './style.module.scss'

export const Header = (props: HeaderProps) => {
  const { pathname } = useLocation()
  const pathnames = pathname.split('/').filter((item) => item)
  const title = pathnames[pathnames.length - 1] === 'monitoring' ? 'Chart' : pathnames[pathnames.length - 1]
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleShowPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const signOut = () => {
    location.replace('/login')
    removeCookie('access')
  }

  return (
    <Box className={styles.Box}>
      <Typography className={styles.Title} variant='h6' noWrap>
        {props.titleHeader ? props.titleHeader : title ? title : 'Dashboard'}
      </Typography>
      <Box className={styles.Info}>
        {props.rightHeader}
        <Button onClick={handleShowPopover} className={styles.Button}>
          <Avatar src={props.src} sx={{ width: 32, height: 32 }}>
            {props.username && props.username.charAt(0)}
          </Avatar>
        </Button>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          classes={{ paper: styles.PopoverSelect, root: styles.PopoverRoot }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          onClose={() => setAnchorEl(null)}>
          <MenuItem
            classes={{
              root: styles.MenuItem
            }}
            onClick={signOut}>
            Log out
          </MenuItem>
        </Popover>
      </Box>
    </Box>
  )
}
