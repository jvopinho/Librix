import { createContext, useEffect, useState } from 'react'
import { getApiUrl } from '../helpers/api-url'
import { pcall } from '../utils/pcall'
import { deleteCookie, getCookie } from '../utils/cookies-utils'
import type { APIUser } from '@librix/types'

function logout() {
  deleteCookie('session_token')

  window.location.href = '/'
}

interface UserContextValue {
  user: APIUser | null
  isAuthenticated(): boolean
  logout(): void
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  isAuthenticated() {
    return !!this.user
  },
  logout
})
  
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<APIUser | null>(null)

  useEffect(() => {
    fetch(getApiUrl('/users/@me'), {
        headers: {
            'Authorization': getCookie('session_token'),
        }
    })
      .then(async (response) => {
        if (!response.ok) {
            const [_error, data] = await pcall(() => response.json())
            throw new Error(data?.message || 'Falha ao obter dados do usuário\nTente novamente mais tarde.')
        }

        return response.json()
      })
      .then((data) => {
        setUser(data)
      })
      .catch(() => {
        setUser(null)
      })
  }, [])

  return (
    <UserContext.Provider value={{ user, isAuthenticated() { return !!user }, logout }}>
      {children}
    </UserContext.Provider>
  )
}