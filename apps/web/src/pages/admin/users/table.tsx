import type { APIUser } from "@librix/types"
import { CreateUserRow } from "./create-row"
import { UserRow } from "./row"

import styles from './styles.module.scss'

type Props = {
  users: APIUser[]
  creating: boolean
  editingUser: APIUser | null

  form: {
    name: string
    email: string
  }

  newUserForm: {
    name: string
    email: string
  }

  onFormChange: React.Dispatch<
    React.SetStateAction<{
      name: string
      email: string
    }>
  >

  onNewUserFormChange: React.Dispatch<
    React.SetStateAction<{
      name: string
      email: string
    }>
  >

  onEdit: (
    user: APIUser,
  ) => void

  onSave: (
    id: number,
  ) => void

  onDelete: (
    id: number,
  ) => void

  onCancel: () => void

  onCreateUser: () => void

  onCancelCreate: () => void
}

export function UserTable({
  users,
  creating,
  editingUser,
  form,
  newUserForm,
  onFormChange,
  onNewUserFormChange,
  onEdit,
  onSave,
  onDelete,
  onCancel,
  onCreateUser,
  onCancelCreate,
}: Props) {
  return (
    <div className={styles['table-container']}>
      <table>
        <thead>
          <tr>
            <th />
            <th>Nome</th>
            <th>E-mail</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {creating && (
            <CreateUserRow
              form={newUserForm}
              onChange={
                onNewUserFormChange
              }
              onSave={
                onCreateUser
              }
              onCancel={
                onCancelCreate
              }
            />
          )}

          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              editing={
                editingUser?.id ===
                user.id
              }
              form={form}
              onFormChange={
                onFormChange
              }
              onEdit={onEdit}
              onSave={onSave}
              onDelete={onDelete}
              onCancel={onCancel}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}