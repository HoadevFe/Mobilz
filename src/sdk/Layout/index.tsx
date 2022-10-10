import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Box,
  BoxProps,
  Button,
  createTheme,
  CssBaseline,
  Drawer,
  IconButton,
  ThemeProvider,
  Toolbar,
  useMediaQuery
} from '@mui/material'
import clsx from 'clsx'
import { useRef, useState } from 'react'
import { Header } from '../Header'
import { SideMenu } from '../SideMenu/SideMenu'
import { SideMenuContent } from '../SideMenu/SideMenuContent'
import styles from './style.module.scss'

const drawerWidth = 56

const theme = createTheme({ typography: { fontFamily: 'Mulish' } })

interface Props extends BoxProps {}

export declare type HeaderProps = {
  title?: string
  src?: string
  username?: string
  titleHeader?: string
  rightHeader?: JSX.Element
}

export function Layout(props: Props & HeaderProps): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const matches = useMediaQuery('(min-width: 900px')
  const { current: container } = useRef(document.getElementsByTagName('body')[0])
  const drawer = <SideMenu />
  const drawerContent = <SideMenuContent />
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer)
  }
  return (
    <ThemeProvider theme={theme}>
      <Box className={styles.AppLayout}>
        <CssBaseline />
        <AppBar
          className={styles.Appbar}
          position='fixed'
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px`, md: `${drawerWidth}px` }
          }}>
          <Toolbar className={styles.Toolbar}>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                ml: 0,
                display: { md: 'none' },
                color: '#ffffff'
              }}>
              <MenuIcon />
            </IconButton>
            <Header {...props} />
          </Toolbar>
        </AppBar>
        <Box
          component='nav'
          sx={{ width: { sm: drawerWidth, md: drawerWidth }, flexShrink: { sm: 0, md: 0 }, backgroundColor: '#000000' }}
          aria-label='mailbox folders'>
          <Drawer
            container={container}
            variant='temporary'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
            }}>
            {drawer}
          </Drawer>
          <Drawer
            variant='permanent'
            sx={{
              display: { xs: 'none', sm: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                backgroundColor: '#000000',
                zIndex: 1300,
                borderRight: '1px solid rgba(204, 204, 220, 0.07)'
              }
            }}
            open>
            {drawer}
          </Drawer>
          <Drawer
            anchor={'left'}
            open={openDrawer}
            onClose={toggleDrawer}
            sx={{
              display: { xs: 'none', sm: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: 290,
                backgroundColor: '#000000',
                marginLeft: `${drawerWidth}px`
              }
            }}>
            {drawerContent}
          </Drawer>
        </Box>
        <Toolbar />
        <div className={styles.MainContent}>
          <Box component='main' className={styles.BoxContainer}>
            {props.children}
          </Box>
        </div>
      </Box>
      <Button className={clsx(styles.btnMenu, openDrawer && styles.positionButton)} onClick={toggleDrawer}>
        {openDrawer ? <ChevronLeft /> : <ChevronRight />}
      </Button>
    </ThemeProvider>
  )
}
