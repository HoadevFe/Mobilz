import DashboardIcon from '@mui/icons-material/Dashboard'
import DevicesIcon from '@mui/icons-material/Devices'
import GroupsIcon from '@mui/icons-material/Group'
import PersonPinIcon from '@mui/icons-material/PersonPin'
import SettingsIcon from '@mui/icons-material/Settings'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'

export const DataMenu = [
  {
    icon: <DashboardIcon />,
    title: 'Dashboard',
    path: '/'
  },
  {
    icon: <GroupsIcon />,
    title: 'User Management',
    path: '/user',
    onlyAdmin: true
  },
  {
    icon: <SettingsIcon />,
    title: 'Settings',
    path: '/setting',
    onlyAdmin: true
  },
  {
    icon: <DevicesIcon />,
    title: 'Devices',
    path: '/devices'
  },
  {
    icon: <PersonPinIcon />,
    title: 'Monitoring',
    path: '/monitoring'
  },
  {
    icon: <StickyNote2Icon />,
    title: 'Release Notes',
    path: '/release-notes'
  }
]
