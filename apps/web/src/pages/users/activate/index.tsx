import { type ChangeEvent, type SubmitEvent, useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { getApiUrl } from '../../../helpers/api-url'
import { pcall } from '../../../utils/pcall'

export function ActivateAccount() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  const nameFromUrl = urlParams.get('name')

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        window.location.href = '/users/activate/invalid'
        return
      }
      
      try {
        const response = await fetch(getApiUrl(`/users/verify_activation_token?token=${token}`), {
          method: 'HEAD',
        })

        if (!response.ok) {
          window.location.href = '/users/activate/invalid'
        }
      } catch (error) {
        window.location.href = '/users/activate/invalid'
      }
    }

    verifyToken().then(() => {
      if (nameFromUrl) {
        setName(decodeURIComponent(nameFromUrl).toString())
      }
    })
  }, [])

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      setAvatar(null)
      setAvatarPreview(null)
      return
    }

    setAvatar(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (password.length < 4) {
      alert('A senha deve ter pelo menos 4 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      alert('As senhas não conferem. \nVerifique e tente novamente.')
      return
    }

    const formData = new FormData()
    
    formData.append('data', JSON.stringify({
      token,
      password,
    }))

    if(avatar) {
      formData.append('avatar', avatar as Blob, `avatar.${avatar.name.split('.').pop()}`)
    }

    const response = await fetch(getApiUrl('/users/activate_account'), {
      method: 'POST',
      body: formData,
    })

    if(!response.ok) {
      const [_error, data] = await pcall(() => response.json())
      alert(`Erro ao ativar conta${data?.message ? `: ${data.message}` : ''}`)
      return
    }

    alert('Conta ativada com sucesso! Você já pode fazer login.')
    window.location.href = '/login'
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1>Ativar conta</h1>

          <p>
            Complete seus dados para finalizar a ativação da sua conta.
          </p>
        </header>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.avatarSection}>
            <label htmlFor="avatar-upload">
              <div className={styles.avatarPreview}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                  />
                ) : (
                  <span>Avatar</span>
                )}
              </div>
            </label>

            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />

            {avatar && (
              <button type="button" className={styles.removeAvatarButton} onClick={() => {
                setAvatar(null)
                setAvatarPreview(null)
              }}>
                Remover Avatar
              </button>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="name">
              Nome
            </label>

            <input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              value={name.toUpperCase()}
              onChange={(e) => setName(e.target.value)}
              disabled
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">
              Senha
            </label>

            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirm-password">
              Confirmar senha
            </label>

            <input
              id="confirm-password"
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={styles.primaryButton}
          >
            Ativar conta
          </button>
        </form>
      </div>
    </div>
  )
}