import { type SubmitEvent, useState } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

import styles from './styles.module.scss'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()

    if (!email.trim()) {
      return
    }

    try {
      setIsSubmitting(true)

      // TODO: Implementar recuperação de senha
      // await api.post('/auth/forgot-password', { email })

      setEmailSent(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (emailSent) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.successIcon}>
            <Mail />
          </div>

          <div className={styles.content}>
            <h1>Verifique seu e-mail</h1>

            <p>
              Se existir uma conta associada a{' '}
              <strong>{email}</strong>,
              você receberá instruções para redefinir sua senha.
            </p>

            <p>
              Caso não encontre a mensagem, confira também a pasta de spam.
            </p>
          </div>

          <Link
            to="/login"
            className={`${styles.button} ${styles.primary}`}
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1>Esqueceu sua senha?</h1>

          <p>
            Informe o e-mail associado à sua conta para receber
            um link de redefinição.
          </p>
        </header>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.formGroup}>
            <label htmlFor="email">
              E-mail
            </label>

            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={`${styles.button} ${styles.primary}`}
            disabled={isSubmitting}
          >
            <Mail />

            {isSubmitting
              ? 'Enviando...'
              : 'Enviar link de recuperação'}
          </button>
        </form>

        <Link
          to="/login"
          className={styles.backLink}
        >
          <ArrowLeft />
          Voltar para o login
        </Link>
      </div>
    </div>
  )
}