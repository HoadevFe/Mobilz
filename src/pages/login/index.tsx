import { VisibilityOff } from '@mui/icons-material'
import { Button, IconButton, TextField, Typography } from '@mui/material'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LOGIN_ENDPOINT } from '../../constants/ApiConstant'
import { ApiCore, setCookie } from '../../sdk'
import eyeOnIc from './eyeOn.svg'
import LogoIcon from './LogoIcon.svg'
import styles from './styles.module.scss'

interface DataLogin {
  email?: string
  password?: string
}

const BUILD_VERSION = process.env.BUILD_VERSION || '1.0.0'
const BUILD_TIME = process.env.BUILD_TIME || new Date().toDateString()

const HelperText = ({ message }: { message?: string }) => <p className={styles.HelpText}>{message}</p>
export default function Login() {
  const [toggleIconEye, setToggleIconEye] = useState(true)
  const [errorLogin, setErrorLogin] = useState(false)
  const { register, handleSubmit } = useForm()
  const loginRef = useRef<DataLogin>({})

  const toggleIconPassword = (toggle: boolean) => {
    setToggleIconEye(!toggle)
  }

  const onSubmit = () => {
    ApiCore.post(`${LOGIN_ENDPOINT}`, loginRef.current)
      .then((res) => {
        const expires = res.data.expiresIn.split(/(\d+)/)
        const expiresIn = new Date(dayjs().add(expires[1], expires[2]).format()).toUTCString()
        const searchLocation = new URLSearchParams(location.search).get('redirectUrl')
        setCookie('access', res.data.accessToken, expiresIn)
        location.replace(searchLocation || '/')
      })
      .catch((error) => setErrorLogin(true))
  }

  return (
    <div className={styles.appLoginWrapper}>
      <div className={styles.LoginMainContentFormWrapper}>
        <div className={styles.AuthMainContent}>
          <div className={styles.Header}>
            <img src={LogoIcon} className={styles.Logo} />
            <Typography variant='subtitle2' className={styles.textTitleLogo}>
              Dashboard Kit
            </Typography>
            <Typography variant='subtitle2' className={styles.textLoginHeader} color='#CCCEDA'>
              Log In to Dashboard Kit
            </Typography>
            <Typography variant='subtitle2' className={styles.textDescription} color='#9FA2B4'>
              Enter your email and password below
            </Typography>
          </div>
          <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.textField}>
              <Typography variant='subtitle2' className={styles.textLabelForm}>
                Email
              </Typography>
              <TextField
                {...register('email')}
                className={clsx(styles.inputText, errorLogin && styles.inputError)}
                id='outlined-basic'
                variant='outlined'
                placeholder='Email address'
                onChange={(evt) => (loginRef.current.email = evt.currentTarget.value)}
              />
              {errorLogin && <HelperText message='Please enter a valid email address' />}
            </div>
            <div className={styles.textField}>
              <Typography variant='subtitle2' className={styles.textLabelForm}>
                Password
              </Typography>
              <div>
                <div className={styles.inputPasswordWrapper}>
                  <TextField
                    {...register('password')}
                    className={clsx(styles.inputText, errorLogin && styles.inputError)}
                    id='outlined-basic'
                    variant='outlined'
                    placeholder='Password'
                    type={toggleIconEye ? 'password' : 'text'}
                    onChange={(evt) => (loginRef.current.password = evt.currentTarget.value)}
                  />
                  <IconButton
                    className={styles.endButton}
                    onClick={() => {
                      toggleIconPassword(toggleIconEye)
                    }}>
                    {toggleIconEye ? <VisibilityOff /> : <img src={eyeOnIc} />}
                  </IconButton>
                </div>
                {errorLogin && <HelperText message='Please enter a valid password' />}
              </div>
            </div>

            <Button className={styles.buttonSubmit} type='submit' variant='contained'>
              Login
            </Button>
          </form>
          <p className={styles.version}>{`Version ${BUILD_VERSION} | Build ${BUILD_TIME}`}</p>
        </div>
      </div>
    </div>
  )
}
