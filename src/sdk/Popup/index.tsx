import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, DialogTitleProps, IconButton, Typography } from '@mui/material';
import clsx from 'clsx';
import styles from './style.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import { PrimaryButton, TextButton } from '../Button';

interface CustomDialogProps {
  titlePopup?: JSX.Element | string;
}

const CloseableDialogTitle = (props: DialogTitleProps) => {
  return (
    <DialogTitle
      {...props}
    >
      <Typography variant="h6" className={styles.DialogTitleContent}>
        {props.children}
      </Typography>
      <IconButton
        aria-label="close"
        className={styles.DialogTitleIconClose}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );

}

export const Popup = (props: DialogProps & CustomDialogProps) => {
  const {
    className,
    children,
    titlePopup,
    PaperProps,
    ...rest
  } = props;

  return (
    <Dialog
      {...rest}
      className={clsx(styles.DialogRoot, className)}
      PaperProps={{
        classes: {
          root: styles.PaperRoot
        },
        ...PaperProps
      }}
    >
      <CloseableDialogTitle className={clsx(styles.DiaLogTitleRoot, className)}>
        {titlePopup}
      </CloseableDialogTitle>
      <DialogContent className={clsx(styles.DialogContentRoot, styles.DialogContentTextRoot, className)}>
        {children}
      </DialogContent>
      <DialogActions className={clsx(styles.DialogActionsRoot, className)}>
        <TextButton>Cancel</TextButton>
        <PrimaryButton>Text Button</PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}