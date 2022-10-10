import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import { Divider, MenuItem, Select, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { USER_ENDPOINT } from 'constants/ApiConstant'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore, useListViewStore } from 'sdk'
import { HttpMethod, invokeRequest } from 'sdk/ApiCore'
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

export const EditUser = (props: { userId: string; userName: string; userRole: string }) => {
  const { userId, userName, userRole } = props
  const [open, setOpen] = useState(false)
  const userRef = useRef<DataUser>({})
  const onRefetch = useListViewStore((store) => store.onRefetch)
  const isRoleAdmin = useAuthStore((store) => store.auth?.role === 'ADMIN')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ mode: 'onBlur' })

  const handleClickOpen = () => {
    reset({ username: userName })
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = () => {
    invokeRequest({
      baseURL: `${USER_ENDPOINT}/${userId}`,
      method: HttpMethod.PATCH,
      params: userRef.current,
      onSuccess() {
        onRefetch('user')
        handleClose()
      },
      onError() {}
    })
  }

  if (!isRoleAdmin) return <></>

  return (
    <div>
      <Button className={styles.buttonEdit} variant='outlined' onClick={handleClickOpen}>
        {<EditIcon />}
      </Button>
      <Dialog
        PaperProps={{ classes: { root: styles.DialogRoot } }}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
          Edit User
        </BootstrapDialogTitle>
        <DialogContent className={styles.DialogContentEdit} dividers>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.content}>
              <p className={styles.title}>Name</p>
              <div className={styles.textField}>
                <TextField
                  {...register('username', { minLength: 5 })}
                  className={styles.inputText}
                  id='outlined'
                  variant='outlined'
                  placeholder='Enter Name'
                  defaultValue={userName}
                  onChange={(evt) => (userRef.current.name = evt.currentTarget.value)}
                />
                {errors.username && <p style={{ color: 'red' }}>Enter more than 5 characters</p>}
              </div>
              <Divider className={styles.divider} />
              <p className={styles.title}>Role</p>
              <div className={styles.textField}>
                <Select
                  className={styles.Select}
                  id='demo-select-small'
                  defaultValue={userRole}
                  onChange={(evt) => (userRef.current.role = evt.target.value)}
                  MenuProps={{ classes: { list: styles.menuItemSelect } }}>
                  <MenuItem value={'ADMIN'}>ADMIN</MenuItem>
                  <MenuItem value={'USER'}>USER</MenuItem>
                </Select>
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions className={styles.DialogActionsEdit}>
          <Button className={styles.btnSubmit} variant='contained' onClick={onSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
