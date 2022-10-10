import { Button } from '@mui/material'
import { USER_ENDPOINT } from 'constants/ApiConstant'
import { useState } from 'react'
import { Column, Flex, FlexItem, Layout, ListView, useAuthStore } from 'sdk'
import { DateCell } from '../../shared-components'
import { AddUser } from './ActionUser/AddUser'
import { DeleteUser } from './ActionUser/DeleteUser'
import { EditUser } from './ActionUser/EditUser'
import styles from './style.module.scss'

const renderPosition = (_: unknown, idx = 0) => {
  const search = new URLSearchParams(location.search)
  const currentPage = Number(search.get('page') || 1)
  const currentSize = Number(search.get('size') || 10)
  return <>{idx + 1 + (currentPage - 1) * currentSize}</>
}

class UserList {
  @Column({ title: '#', render: renderPosition })
  stt?: string

  @Column({ title: 'Name' })
  name?: string

  @Column({ title: 'Email' })
  email?: string

  @Column({
    title: 'Created Date',
    render: ({ createdAt }) => <DateCell value={createdAt} />
  })
  createdAt?: Date

  @Column({
    title: 'Last Login Date',
    render: ({ lastLoginAt }) => <DateCell value={lastLoginAt} />
  })
  lastLoginAt?: Date

  @Column({ title: 'Role' })
  role?: string

  @Column({
    title: 'Action',
    render: ({ id, name, role }) => {
      return (
        <Flex direction={'row'}>
          <FlexItem>
            <EditUser userId={id} userName={name} userRole={role} />
            <DeleteUser userId={id} />
          </FlexItem>
        </Flex>
      )
    }
  })
  action?: string
}
export default function UserManagement() {
  const [openFormAdd, setFormAdd] = useState(false)
  const isRoleAdmin = useAuthStore((store) => store.auth?.role === 'ADMIN')

  return (
    <Layout titleHeader='User Management'>
      <AddUser open={openFormAdd} onClose={() => setFormAdd(false)} />
      <ListView
        title='List Users'
        search
        model={UserList}
        baseURL={USER_ENDPOINT}
        id='user'
        extraHeader={
          isRoleAdmin && (
            <Button className={styles.btnAddUser} onClick={() => setFormAdd(true)}>
              Add Users
            </Button>
          )
        }
      />
    </Layout>
  )
}
