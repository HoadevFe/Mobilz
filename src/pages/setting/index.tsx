import { VisibilityOff } from '@mui/icons-material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Button, Divider, Grid, IconButton, Skeleton, Switch, TextField, Tooltip } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ApiCore, HttpMethod, invokeRequest, Layout, useAuthStore, useNotificationStore } from 'sdk'
import { SETTING_ENDPOINT } from '../../constants/ApiConstant'
import eyeShowIc from './eyeShow.svg'
import styles from './style.module.scss'
interface DataSetting {
  id?: string
  duration?: number
  enable2fa?: boolean
  version?: number
  dataUrl?: string
  accessToken?: unknown
  createdAt?: string
  updatedAt?: unknown
  serverUrl?: unknown
  serverToken?: unknown
}

const URL_PATTERN = /^(http(s)?)/g

const validateUrl = async (value: string) => {
  if (!value || value.length === 0) return undefined

  try {
    const resp = await ApiCore.get(value, { timeout: 5000 })
    return `${resp.status}`.match(/^(2|3)/g) ? undefined : false
  } catch (error) {
    return false
  }
}

const SettingSkeleton = () => (
  <Grid container spacing={2}>
    <Grid classes={{ root: styles.GridRoot }} item xs={5}>
      <Grid container spacing={12}>
        <Grid item xs={6}>
          <Skeleton className={styles.skeleton} variant='rectangular' width='100%' height='3.75rem' />
        </Grid>
        <Grid item xs={6}>
          <Skeleton className={styles.skeleton} variant='rectangular' width='100%' height='3.75rem' />
        </Grid>
      </Grid>
      <Divider className={styles.divider} />
      <Skeleton className={styles.skeleton} variant='rectangular' width='100%' height='3.25rem' />
      <Divider className={styles.divider} />
      <Skeleton className={styles.skeleton} variant='rectangular' width='100%' height='100%' />
    </Grid>
  </Grid>
)

const HelperText = ({ message }: { message?: string }) => <p style={{ color: 'red', textAlign: 'left' }}>{message}</p>

export default function Setting() {
  const [dataSetting, setDataSetting] = useState<DataSetting>({})
  const [loading, setLoading] = useState(true)
  const [toggleIconEye, setToggleIconEye] = useState(true)
  const settingRef = useRef<DataSetting>({})
  const dispatchNotification = useNotificationStore((store) => store.dispatchNotification)
  const isRoleAdmin = useAuthStore((store) => store.auth?.role === 'ADMIN')

  const toggleIconPassword = (toggle: boolean) => {
    setToggleIconEye(!toggle)
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'onBlur' })

  useEffect(() => {
    const fetchApi = () => {
      ApiCore.get(SETTING_ENDPOINT).then((res) => {
        setLoading(false)
        setDataSetting(res.data)
      })
    }
    fetchApi()
  }, [])

  const onSubmit = async () => {
    invokeRequest({
      baseURL: `${SETTING_ENDPOINT}/${dataSetting?.id}`,
      method: HttpMethod.PATCH,
      params: settingRef.current,
      onSuccess() {},
      onError: dispatchNotification
    })
  }

  return (
    <Layout>
      {loading ? (
        <SettingSkeleton />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid classes={{ root: styles.GridRoot }} item xs={5}>
              <div className={styles.content}>
                <p className={styles.title}>SERVER ACCESS TOKEN</p>
                <div className={styles.inputPasswordWrapper}>
                  <TextField
                    disabled={isRoleAdmin ? false : true}
                    className={styles.inputText}
                    id='outlined-basic'
                    variant='outlined'
                    placeholder='Server Access Token'
                    defaultValue={dataSetting.serverToken}
                    type={toggleIconEye ? 'password' : 'text'}
                    onChange={(evt) => (settingRef.current.serverToken = evt.currentTarget.value)}
                  />
                  {isRoleAdmin && (
                    <IconButton
                      className={styles.endButton}
                      onClick={() => {
                        toggleIconPassword(toggleIconEye)
                      }}>
                      {toggleIconEye ? <VisibilityOff /> : <img src={eyeShowIc} />}
                    </IconButton>
                  )}
                </div>
              </div>
              <Divider className={styles.divider} />
              <HelperText
                message='This session is for the purpose to uprade the setting on the device. 
              Ensure that you know what you are modifying'
              />
              <Grid container spacing={12}>
                <Grid item xs={6}>
                  <div className={styles.form}>
                    <p>Duration (Second)</p>
                    <TextField
                      disabled={isRoleAdmin ? false : true}
                      {...register('duration', { min: 5, max: 1800 })}
                      className={styles.formTextField}
                      size='small'
                      id='outlined-uncontrolled'
                      defaultValue={dataSetting.duration}
                      onChange={(evt) => (settingRef.current.duration = Number(evt.currentTarget.value))}
                    />
                    {errors.duration && (
                      <HelperText message='Duration must not be less than 5 and not be greater than 1800' />
                    )}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className={styles.form}>
                    <div className={styles.formVersion}>
                      <p>Version</p>
                      <Tooltip
                        classes={{ tooltip: styles.tooltip }}
                        title='Changing this value may overwrite the settings on device'
                        placement='top'
                        arrow>
                        <p className={styles.iconVersion}>
                          <HelpOutlineIcon />
                        </p>
                      </Tooltip>
                    </div>
                    <TextField
                      disabled={isRoleAdmin ? false : true}
                      {...register('version', { min: dataSetting.version })}
                      className={styles.formTextField}
                      size='small'
                      id='outlined-uncontrolled'
                      defaultValue={dataSetting.version}
                      onChange={(evt) => (settingRef.current.version = Number(evt.currentTarget.value))}
                    />
                    {errors.version && <HelperText message='Enter a number greater than the current number' />}
                  </div>
                </Grid>
              </Grid>
              <div className={styles.content}>
                <p className={styles.title}>SERVER URL</p>
                <div className={styles.textField}>
                  <TextField
                    disabled={isRoleAdmin ? false : true}
                    {...register('serverUrl', { pattern: URL_PATTERN, validate: validateUrl })}
                    className={styles.inputText}
                    id='outlined-basic'
                    variant='outlined'
                    placeholder='Server Url'
                    defaultValue={dataSetting.serverUrl}
                    onChange={(evt) => (settingRef.current.serverUrl = evt.currentTarget.value)}
                  />
                  {errors.serverUrl && <HelperText message='The URL you entered is not valid' />}
                </div>
                <p className={styles.title}>DATABASE URL</p>
                <div className={styles.textField}>
                  <TextField
                    disabled={isRoleAdmin ? false : true}
                    className={styles.inputText}
                    id='outlined-basic'
                    variant='outlined'
                    placeholder='Type database url'
                    defaultValue={dataSetting.dataUrl}
                    onChange={(evt) => (settingRef.current.dataUrl = evt.currentTarget.value)}
                  />
                  {errors.dataUrl && <HelperText message='The URL you entered is not valid' />}
                </div>
                <p className={styles.title}>ACCESS TOKEN</p>
                <div className={styles.textField}>
                  <TextField
                    disabled={isRoleAdmin ? false : true}
                    className={styles.inputText}
                    id='outlined-basic'
                    variant='outlined'
                    placeholder='Access Token'
                    defaultValue={dataSetting.accessToken}
                    onChange={(evt) => (settingRef.current.accessToken = evt.currentTarget.value)}
                  />
                </div>
                <Divider className={styles.divider} />
              </div>
              {isRoleAdmin && (
                <Button className={styles.button} type='submit' variant='contained'>
                  Save
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      )}
    </Layout>
  )
}
