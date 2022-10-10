import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { USER_ENDPOINT } from 'constants/ApiConstant'
import * as React from 'react'
import { GhostButton, HttpMethod, invokeRequest, PrimaryButton, useListViewStore } from 'sdk'
import styles from '../style.module.scss'

interface DataUser {
  createdAt?: string
  email?: string
  id?: string
  lastLoginAt?: string
  enable2fa?: Boolean
  status?: unknown
  role?: string
  name?: string
}

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle className={styles.DialogTitleEdit} {...other}>
      {children}
      {onClose ? (
        <IconButton aria-label='close' onClick={onClose} className={styles.IconButton}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

export const DeleteUser = (props: { userId: string }) => {
  const { userId } = props
  const [open, setOpen] = React.useState(false)
  const onRefetch = useListViewStore((store) => store.onRefetch)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const onSubmit = () => {
    invokeRequest({
      baseURL: `${USER_ENDPOINT}/${userId}`,
      method: HttpMethod.DELETE,
      onSuccess() {
        onRefetch('user')
        handleClose()
      },
      onError() {}
    })
  }

  return (
    <div>
      <Button className={styles.buttonEdit} variant='outlined' onClick={handleClickOpen}>
        {<DeleteIcon />}
      </Button>
      <Dialog
        PaperProps={{ classes: { root: styles.DialogRoot } }}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
          Delete User
        </BootstrapDialogTitle>
        <DialogContent className={styles.DialogContentEdit} dividers>
          <Typography color={'#ffffff'}>Do you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions className={styles.DialogActionsEdit}>
          <GhostButton variant='contained' onClick={handleClose}>
            Cancel
          </GhostButton>
          <PrimaryButton className={styles.btnSubmit} variant='contained' onClick={onSubmit}>
            Delete
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}
