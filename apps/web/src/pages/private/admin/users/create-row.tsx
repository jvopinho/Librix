import { Save, X } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import styles from './styles.module.scss'

type CreateUserForm = {
  name: string
  email: string
}

type Props = {
  form: CreateUserForm

  onChange: Dispatch<
    SetStateAction<CreateUserForm>
  >

  onSave: () => void

  onCancel: () => void
}

export function CreateUserRow({
  form,
  onChange,
  onSave,
  onCancel,
}: Props) {
  return (
    <tr>
      <td className={styles['status']} />

      <td className={styles['name']}>
        <input
          placeholder="Nome do usuário"
          value={form.name}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
      </td>

      <td className={styles['email']}>
        <input
          placeholder="E-mail"
          value={form.email}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
        />
      </td>

      <td className={styles['actions']}>
        <div className={styles['row-actions']}>
          <button
            className={styles['icon-button'] + ' ' + styles['save']}
            onClick={onSave}
          >
            <Save size={16} />
          </button>

          <button
            className={styles['icon-button'] + ' ' + styles['cancel']}
            onClick={onCancel}
          >
            <X size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}