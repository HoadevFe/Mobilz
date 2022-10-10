import { Breadcrumbs, BreadcrumbsProps, } from '@mui/material'
import clsx from 'clsx'
import styles from './style.module.scss'

export const BreadcrumbsNavigation = (props: BreadcrumbsProps) => {
  const { className, children, classes, ...rest } = props;
  return (
    <Breadcrumbs
      {...rest}
      className={clsx(styles.BreadcrumbsRoot, className)}
      classes={{
        ol: styles.BreadcrumbsOl,
        li: styles.BreadcrumbsLi,
        ...classes
      }}
    >
      {children}
    </Breadcrumbs>
  )
}
