import type { APIUser } from "@librix/types"
import { useEffect, useState } from "react"
import { getApiUrl } from "../../../../helpers/api-url"
import { UsersToolbar } from "./tool-bar"
import { UserTable } from "./table"

import styles from './styles.module.scss'

export function AdminUsersPage() {
  const [users, setUsers] = useState<APIUser[]>([])
    const [search, setSearch] = useState('')
  
    const [editingUser, setEditingUser] = useState<APIUser | null>(null)
  
    const [creating, setCreating] = useState(false)
  
    const [form, setForm] = useState({
      name: '',
      email: '',
    })
  
    const [newUserForm, setNewUserForm] = useState({
      name: '',
      email: '',
    })
  
    function handleEdit(user: APIUser) {
      setCreating(false)
  
      setEditingUser(user)
  
      setForm({
        name: user.name,
        email: user.email,
      })
    }
  
    function handleCancel() {
      setEditingUser(null)
  
      setForm({
        name: '',
        email: '',
      })
    }
  
    async function handleSave(id: number) {
      if (!form.name.trim() || !form.email.trim()) {
        return
      }

      try {
        console.log(import.meta.env.VITE_API_URL);
        const response = await fetch(
          getApiUrl(`/users/${id}`),
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: form.name,
              email: form.email,
            }),
          },
        )
  
        const data = await response.json()
  
        if (!response.ok) {
          const message =
            data?.message ??
            'Ocorreu um erro ao editar o usuário.'
  
          alert(
            `${message}\n\nTente novamente mais tarde.`,
          )
  
          return
        }
  
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id
              ? {
                  ...user,
                  name: data.name,
                  email: data.email,
                  actived: data.actived,
                }
              : user,
          ),
        )
  
        setEditingUser(null)
  
        setForm({
          name: '',
          email: '',
        })
      } catch (error) {
        console.error(
          'Error editing user:',
          error,
        )
  
        alert(
          'Não foi possível conectar com o servidor. Verifique sua conexão e tente novamente.',
        )
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                name: form.name,
                email: form.email,
              }
            : user,
        ),
      )
  
      setEditingUser(null)
  
      setForm({
        name: '',
        email: '',
      })
    }
  
    async function handleDelete(id: number) {
      try {
        console.log(import.meta.env.VITE_API_URL);
        const response = await fetch(
          getApiUrl(`/users/${id}`),
          {
            method: 'DELETE',
          },
        )
  
        if (!response.ok) {
          const message = 'Ocorreu um erro ao deletar o usuário.'
  
          alert(
            `${message}\n\nTente novamente mais tarde.`,
          )
  
          return
        }
  
        setUsers((prev) => prev.filter((user) => user.id !== id))
  
        setEditingUser(null)
  
        setForm({
          name: '',
          email: '',
        })
      } catch (error) {
        console.error(
          'Error deleting user:',
          error,
        )
  
        alert(
          'Não foi possível conectar com o servidor. Verifique sua conexão e tente novamente.',
        )
      }
    }
  
    function handleCreate() {
      setEditingUser(null)
  
      setCreating(true)
  
      setNewUserForm({
        name: '',
        email: '',
      })
    }
  
    function handleCancelCreate() {
      setCreating(false)
  
      setNewUserForm({
        name: '',
        email: '',
      })
    }
  
    async function handleCreateUser() {
      if (
        !newUserForm.name.trim() ||
        !newUserForm.email.trim()
      ) {
        return
      }
  
      try {
        console.log(import.meta.env.VITE_API_URL);
        const response = await fetch(
          getApiUrl('/users'),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: newUserForm.name,
              email: newUserForm.email,
            }),
          },
        )
  
        const data = await response.json()
  
        if (!response.ok) {
          const message =
            data?.message ??
            'Ocorreu um erro ao criar o usuário.'
  
          alert(
            `${message}\n\nTente novamente mais tarde.`,
          )
  
          return
        }
  
        const newUser: APIUser = {
          id: data.id,
          name: data.name,
          avatar: data.avatar,
          email: data.email,
          actived: data.actived,
        }
  
        setUsers((prev) => [
          newUser,
          ...prev,
        ])
  
        setCreating(false)
  
        setNewUserForm({
          name: '',
          email: '',
        })
      } catch (error) {
        console.error(
          'Error creating user:',
          error,
        )
  
        alert(
          'Não foi possível conectar com o servidor. Verifique sua conexão e tente novamente.',
        )
      }
    }
  
    const filteredUsers = users.filter(
      (user) =>
        user.name
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          ) ||
        user.email
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          ),
    )
  
    useEffect(() => {
      async function fetchUsers() {
        try {
          const response = await fetch(
            getApiUrl('/users'),
          )
  
          console.log(response);
  
          if (!response.ok) {
            throw new Error(
              'Failed to fetch users',
            )
          }
  
          const data: APIUser[] =
            await response.json()
  
          setUsers(data)
        } catch (error) {
          console.error(
            'Error fetching users:',
            error,
          )
  
          alert(
            'Não foi possível carregar os usuários. Verifique sua conexão e tente novamente.',
          )
        }
      }
  
      fetchUsers()
    }, [])

  return (
    <div className={styles['users-page']}>
      <div className={styles['page-header']}>
        <div>
          <h1>Usuários</h1>

          <p>
            Gerencie administradores,
            bibliotecários e leitores.
          </p>
        </div>
      </div>

      <UsersToolbar
        search={search}
        setSearch={setSearch}
        onCreate={handleCreate}
        disabled={
          creating ||
          editingUser !== null
        }
      />

      <UserTable
        users={filteredUsers}
        creating={creating}
        editingUser={editingUser}
        form={form}
        newUserForm={newUserForm}
        onFormChange={setForm}
        onNewUserFormChange={
          setNewUserForm
        }
        onEdit={handleEdit}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={handleCancel}
        onCreateUser={
          handleCreateUser
        }
        onCancelCreate={
          handleCancelCreate
        }
      />
    </div>
  )
}