import { Tabs, TabsProps } from '@mui/material';
import clsx from 'clsx';
import styles from './style.module.scss';

export const BasicTabs = (props: TabsProps) => {
  return (
    <Tabs
      {...props}
      className={clsx(styles.BasicTabs, props.className)}
      classes={{
        flexContainer: styles.BasicContainer,
        indicator: styles.BasicIndicator
      }}
    >
      {props.children}
    </Tabs>
  );
};

export const PaneTabs = (props: TabsProps) => {
  return (
    <Tabs
      {...props}
      className={clsx(styles.PaneTabs, props.className)}
      classes={{
        flexContainer: styles.PaneContainer,
        indicator: styles.PaneIndicator
      }}
      TabIndicatorProps={{
        children: <span />
      }}
    >
      {props.children}
    </Tabs>
  );
};
