import styles from './styles.module.scss'

type Props = {
  search: string
  setSearch: (
    value: string,
  ) => void
  onCreate: () => void
  disabled: boolean
}

export function UsersToolbar({
  search,
  setSearch,
  onCreate,
  disabled,
}: Props) {
  return (
    <div className={styles['toolbar']}>
      <button
        className={styles['primary-button']}
        onClick={onCreate}
        disabled={disabled}
      >
        + Novo Usuário
      </button>

      <input
        type="text"
        placeholder="Buscar usuário..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />
    </div>
  )
}