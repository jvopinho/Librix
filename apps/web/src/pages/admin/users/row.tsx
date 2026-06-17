import { Hourglass, Pencil, Save, Shield, Trash2, X } from "lucide-react";
import type { Dispatch, SetStateAction } from 'react'
import type { APIUser } from '@librix/types'

import styles from './styles.module.scss'

type EditForm = {
  name: string
  email: string
}

type Props = {
  user: APIUser
  editing: boolean

  form: EditForm

  onFormChange: Dispatch<
    SetStateAction<EditForm>
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
}

export function UserRow({
  user,
  editing,
  form,
  onFormChange,
  onEdit,
  onSave,
  onDelete,
  onCancel,
}: Props) {
  return (
    <tr>
      <td
        className={styles['status']}
        title={
          !user.actived
            ? 'O usuário ainda não ativou a conta'
            : ''
        }
      >
        {!user.actived && (
          <Hourglass size={18} />
        )}
      </td>

      <td className={styles['name']}>
        {editing ? (
          <input
            value={form.name}
            onChange={(e) =>
              onFormChange((prev: { name: string; email: string }) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        ) : (
          user.name
        )}
      </td>

      <td className={styles['email']}>
        {editing ? (
          <input
            value={form.email}
            onChange={(e) =>
              onFormChange((prev: { name: string; email: string }) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
        ) : (
          user.email
        )}
      </td>

      <td>
        {editing ? (
          <div className={styles['row-actions']}>
            <button
              className={styles['permissions-button']}
            >
              <Shield size={14} />
            </button>

            <button
              className={styles['icon-button'] + ' ' + styles['save']}
              onClick={() =>
                onSave(user.id)
              }
            >
              <Save size={16} />
            </button>

            <button
              className={styles['icon-button'] + ' ' + styles['delete']}
              onClick={() =>
                onDelete(user.id)
              }
            >
              <Trash2 size={16} />
            </button>

            <button
              className={styles['icon-button'] + ' ' + styles['cancel']}
              onClick={onCancel}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            className={styles['icon-button'] + ' ' + styles['edit']}
            onClick={() =>
              onEdit(user)
            }
          >
            <Pencil size={16} />
          </button>
        )}
      </td>
    </tr>
  )
}