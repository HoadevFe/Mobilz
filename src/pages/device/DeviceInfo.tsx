import CloseIcon from '@mui/icons-material/Close'
import { Grid } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { DEVICE_ENDPOINT } from 'constants/ApiConstant'
import dayjs from 'dayjs'
import { useState } from 'react'
import { ApiCore, handleDownload } from 'sdk'
import styles from './style.module.scss'

interface DataDetailDevice {
  countryName?: string
  ipAddress?: string
  mcc?: string
  mnc?: string
  operator?: string
  otherInformation?: string
  note?: string
  updatedAt?: string
}

export interface DialogTitleProps {
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

const DeviceInfo = (dataKcell: DataDetailDevice) => {
  return (
    <div className={styles.content}>
      <Grid container spacing={3}>
        <Grid className={styles.GridItem} item xs={6}>
          <p className={styles.title}>MCC</p>
          <div className={styles.textContent}>
            <p className={styles.text}> {dataKcell.mcc}</p>
          </div>
        </Grid>
        <Grid className={styles.GridItem} item xs={6}>
          <p className={styles.title}>MNC</p>
          <div className={styles.textContent}>
            <p className={styles.text}> {dataKcell.mnc}</p>
          </div>
        </Grid>

        <Grid className={styles.GridItem} item xs={6}>
          <p className={styles.title}>Country Name</p>
          <div className={styles.textContent}>
            <p className={styles.text}> {dataKcell.countryName}</p>
          </div>
        </Grid>

        <Grid className={styles.GridItem} item xs={6}>
          <p className={styles.title}>Operator</p>
          <div className={styles.textContent}>
            <p className={styles.text}> {dataKcell.operator}</p>
          </div>
        </Grid>

        <Grid className={styles.GridItem} item xs={12}>
          <p className={styles.title}>Other Information</p>
          <div className={styles.textContent}>
            <p className={styles.text}> {dataKcell.otherInformation}</p>
          </div>
        </Grid>

        <Grid className={styles.GridItem} item xs={12}>
          <p className={styles.title}>Ip Address</p>
          <div className={styles.textContent}>
            <p className={styles.text}> {dataKcell.ipAddress}</p>
          </div>
        </Grid>

        <Grid className={styles.GridItem} item xs={12}>
          <p className={styles.title}>Note</p>
          <div className={styles.textContent}>
            <p className={styles.text}> {dataKcell.note}</p>
          </div>
        </Grid>

        <Grid className={styles.GridItem} item xs={12}>
          <p className={styles.title}>Timestamp</p>
          <div className={styles.textContent}>
            <p className={styles.text}> {dataKcell.updatedAt}</p>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export const DeviceCell = (props: { deviceId?: string; host?: string }) => {
  const { deviceId, host } = props
  const [open, setOpen] = useState(false)
  const [dataKcell, setDataKcell] = useState<DataDetailDevice>({})

  const handleClickOpen = () => {
    if (!dataKcell.countryName) {
      ApiCore.get(`${DEVICE_ENDPOINT}/${deviceId || `serial/${host}`}`).then((res) => {
        setDataKcell(res.data)
      })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onDownload = () => {
    handleDownload(`${DEVICE_ENDPOINT}/export/${deviceId}`, `device-history-${dayjs().format('DDMMYYYHHmmss')}`)
  }

  return (
    <div>
      <Button className={styles.buttonView} variant='contained' onClick={handleClickOpen}>
        Device Info
      </Button>
      <Dialog
        PaperProps={{ classes: { root: styles.DialogRoot } }}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}>
        <BootstrapDialogTitle onClose={handleClose}>Device Info</BootstrapDialogTitle>
        <DialogContent className={styles.DialogContentEdit} dividers>
          {DeviceInfo(dataKcell)}
          <DialogActions className={styles.DialogActionsEdit}>
            <Button onClick={onDownload} className={styles.btnSubmit} variant='contained'>
              Download history
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  )
}
