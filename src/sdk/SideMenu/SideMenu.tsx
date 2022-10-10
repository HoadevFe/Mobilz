import { List, ListItemButton } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from 'sdk/store'
import { DataMenu } from './Data'
import logo1 from './image/Ellipse.png'
import styles from './style.module.scss'

export const SideMenu = () => {
  const isRoleAdmin = useAuthStore((store) => store.auth?.role === 'ADMIN')
  return (
    <div className={styles.SideMenu}>
      <div className={styles.logo}>
        <img className={styles.imgEllipse} src={logo1} alt={logo1} />
        {/* <img className={styles.imgD} src={logo2} alt={logo2} /> */}
        {/* <h4>Dashboard Kit</h4> */}
      </div>
      <List className={styles.list} component='nav'>
        {DataMenu.map((data, index) => {
          if (!isRoleAdmin && data.onlyAdmin) return <></>
          return (
            <div key={index}>
              <NavLink to={data.path} className={styles.navLinnk}>
                <ListItemButton className={styles.ListItemButton}>
                  {data.icon}
                  {/* <ListItemText className={styles.text} primary={data.title} /> */}
                </ListItemButton>
              </NavLink>
            </div>
          )
        })}
      </List>
    </div>
  )
}
