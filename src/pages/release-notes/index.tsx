import { Grid } from '@mui/material'
import clsx from 'clsx'
import React from 'react'
import { Layout } from 'sdk'
import { RELEASE_NOTE } from './release-notes'
import styles from './styles.module.scss'

interface Version {
  title: string
  postedDate: string
  features: Features[]
}
interface Features {
  title: string
  list: { description: string }[]
}
const Feature = React.memo(({ feature }: { feature: Features }) => {
  return (
    <Grid container className='mt-3'>
      <Grid item xs={12} className='mb-2'>
        <span className={styles.ReleaseNoteSmallTitle}>{feature.title}</span>
      </Grid>
      <Grid item xs={12}>
        <ul className='mb-0'>
          {feature.list.map((li, i) => {
            return (
              <li key={i} className={styles.ReleaseNoteContentText}>
                {li.description}
              </li>
            )
          })}
        </ul>
      </Grid>
    </Grid>
  )
})
const Content = ({ versions }: { versions: Version[] }) => {
  return (
    <div className={styles.JRCard}>
      {versions.map((version, x) => {
        return (
          <Grid key={x} container className={clsx(styles.Container, 'mb-3')}>
            <Grid item xs={12} className='mb-2'>
              <div className={styles.ReleaseNoteTitle}>{version.title}</div>
            </Grid>

            <Grid item xs={12}>
              <span className={styles.ReleaseNoteDate}>{version.postedDate}</span>
            </Grid>

            {version.features.map((feature, i) => {
              return <Feature key={i} feature={feature} />
            })}
          </Grid>
        )
      })}
    </div>
  )
}
export default function ReleaseNotes() {
  return (
    <Layout titleHeader={'Release Notes'}>
      <Content versions={RELEASE_NOTE} />
    </Layout>
  )
}
