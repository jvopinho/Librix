import { AlertTriangle, ArrowLeft, HomeIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import styles from './styles.module.scss'

export function InvalidInvitation() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <AlertTriangle />
        </div>

        <div className={styles.content}>
          <h1>Link inválido ou expirado</h1>

          <p>
            O link de ativação que você utilizou não é mais válido.
            Isso pode acontecer porque ele expirou ou já foi utilizado.
          </p>

          <p>
            Solicite um novo convite para continuar o processo de ativação da sua conta.
          </p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.secondary}`}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
            Voltar
          </button>

          <button
            type="button"
            className={`${styles.button} ${styles.primary}`}
            onClick={() => {
              window.location.href = `/home`
            }}
          >
            <HomeIcon />
            Voltar para o início
          </button>

          {/* <button
            type="button"
            className={`${styles.button} ${styles.primary}`}
            onClick={() => {
              // TODO: Implementar solicitação de novo convite
            }}
          >
            <RefreshCw />
            Solicitar novo link
          </button> */}
        </div>
      </div>
    </div>
  )
}