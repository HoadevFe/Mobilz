import { Card, CardContent, Grid, Typography } from '@mui/material'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import styles from '../style.module.scss'
interface Props {
  title?: string
  url: string
  data: { total: number; online: number }
}
export default function CardView(props: Props) {
  const { title, url, data } = props
  return (
    <>
      <Grid item xs={12}>
        <h2>{title}</h2>
      </Grid>
      <Link className={styles.Link} to={url}>
        <div className={styles.content}>
          <Grid item xs={3}>
            <Card className={styles.Card}>
              <CardContent className={styles.CardContent}>
                <Typography variant='h5' component='div' className={clsx(styles.text, styles.Typography)}>
                  Device Registered
                </Typography>
                <Typography variant='body2' className={clsx(styles.number, styles.Typography)}>
                  {data.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </div>
      </Link>
      <Link className={styles.Link} to={`${url}&status=true`}>
        <div className={styles.content}>
          <Grid item xs={3}>
            <Card className={styles.Card}>
              <CardContent className={styles.CardContent}>
                <Typography variant='h5' component='div' className={clsx(styles.text, styles.Typography)}>
                  Online
                </Typography>
                <Typography variant='body2' className={clsx(styles.number, styles.Typography)}>
                  {data.online}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </div>
      </Link>
    </>
  )
}
