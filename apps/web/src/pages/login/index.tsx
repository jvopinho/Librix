import { type SubmitEvent, useState } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'

import styles from './styles.module.scss'
import { setCookie } from '../../utils/cookies-utils'
import { getApiUrl } from '../../helpers/api-url'
import { pcall } from '../../utils/pcall'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault()

    fetch(getApiUrl('/auth/sign-in'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
    .then(async(response) => {
      if (!response.ok) {
        const [_error, data] = await pcall(() => response.json())
        
        throw new Error(data?.message || 'Falha ao realizar login.\nTente novamente mais tarde.')
      }

      return response.json()
    })
    .then((data) => {
      setCookie('access_token', data.access_token, 0.3)

      alert('Login realizado com sucesso! Redirecionando...')
      
      window.location.href = '/'
    })
    .catch((error) => {
      alert(error.message)
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1>Entrar</h1>

          <p>
            Acesse sua conta para continuar.
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

          <div className={styles.formGroup}>
            <div className={styles.passwordHeader}>
              <label htmlFor="password">
                Senha
              </label>

              <Link
                to="/forgot-password"
                className={styles.forgotPassword}
              >
                Esqueceu a senha?
              </Link>
            </div>

            <div className={styles.passwordField}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className={styles.visibilityButton}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? (
                  <EyeOff />
                ) : (
                  <Eye />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.primaryButton}
          >
            <LogIn />

            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}