import { VisibilityOff } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import { Divider, MenuItem, Select, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { CREATE_USER_ENDPOINT } from 'constants/ApiConstant'
import { EMAIL_PATTERN, USER_ROLE } from 'constants/AppConstant'
import { ReactNode, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HttpMethod, invokeRequest, useListViewStore } from 'sdk'
import eyeOnIc from '../../login/eyeOn.svg'
import styles from '../style.module.scss'

export interface DialogTitleProps {
  id: string
  children?: ReactNode
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

const HelperText = ({ message }: { message?: string }) => <p className={styles.HelpText}>{message}</p>

export const AddUser = (props: { open: boolean; onClose: () => void }) => {
  const { open, onClose } = props
  const [select, setSelect] = useState('')
  const [errorEmail, setErrorEmail] = useState(false)
  const [toggleIconEye, setToggleIconEye] = useState(true)
  const onRefetch = useListViewStore((store) => store.onRefetch)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({ mode: 'onBlur' })

  const onCloseForm = () => {
    onClose()
    reset()
    setSelect('')
  }

  const onSubmit = (params: Record<string, unknown>) => {
    invokeRequest({
      baseURL: CREATE_USER_ENDPOINT,
      method: HttpMethod.POST,
      params,
      onSuccess() {
        onRefetch('user', 1)
        onCloseForm()
      },
      onError() {
        setErrorEmail(true)
      }
    })
  }

  return (
    <Dialog PaperProps={{ classes: { root: styles.DialogRoot } }} onClose={onCloseForm} open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={onCloseForm}>
          Add User
        </BootstrapDialogTitle>
        <DialogContent className={styles.DialogContentEdit} dividers>
          <div className={styles.content}>
            <p className={styles.title}>Name</p>
            <div className={styles.textField}>
              <TextField
                {...register('name', { required: true })}
                className={styles.inputText}
                id='outlined'
                variant='outlined'
                placeholder='Enter Name'
              />
              {errors.name && <HelperText message='Please enter a valid name' />}
            </div>
            <Divider className={styles.divider} />
            <p className={styles.title}>Email</p>
            <div className={styles.textField}>
              <TextField
                {...register('email', { required: true, pattern: EMAIL_PATTERN })}
                className={styles.inputText}
                id='outlined'
                variant='outlined'
                placeholder='Enter Email'
              />
              {(errors.email || errorEmail) && (
                <HelperText message={errorEmail ? 'Email already exists' : 'Please enter a valid email address'} />
              )}
            </div>
            <Divider className={styles.divider} />
            <div className={styles.textField}>
              <Typography variant='subtitle2' className={styles.title}>
                Password
              </Typography>
              <div>
                <div className={styles.inputPasswordWrapper}>
                  <TextField
                    {...register('password', { required: true })}
                    className={styles.inputText}
                    id='outlined-basic'
                    variant='outlined'
                    placeholder='Enter Password'
                    type={toggleIconEye ? 'password' : 'text'}
                  />
                  <IconButton
                    className={styles.endButton}
                    onClick={() => {
                      setToggleIconEye(!toggleIconEye)
                    }}>
                    {toggleIconEye ? <VisibilityOff /> : <img src={eyeOnIc} />}
                  </IconButton>
                </div>
                {errors.password && <HelperText message='Please enter a valid password' />}
              </div>
            </div>
            <Divider className={styles.divider} />
            <p className={styles.title}>Role</p>
            <div className={styles.textField}>
              <Controller
                name='role'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={styles.Select}
                    sx={{ width: '100%', background: '#60626e' }}
                    displayEmpty
                    MenuProps={{ classes: { list: styles.menuItemSelect } }}
                    renderValue={select.length > 0 ? undefined : () => <div>Select a Role</div>}
                    onChange={(evt) => {
                      setSelect(evt.target.value as string)
                      field.onChange(evt.target.value)
                    }}>
                    {USER_ROLE.map((opt, index) => (
                      <MenuItem key={index} value={opt.value}>
                        <Typography>{opt.label}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.role && <HelperText message='Please select a role' />}
            </div>
          </div>
        </DialogContent>
        <DialogActions className={styles.DialogActionsEdit}>
          <Button className={styles.btnSubmit} variant='contained' type='submit'>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
