import { Link, NavLink } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import {
    ChevronDown,
    LogOut,
    Settings,
    User,
} from 'lucide-react'

import { useScreenDimensions } from '../../hooks/use-screen-dimensions'
import { useUserContext } from '../../hooks/use-user'
import { getApiUrl } from '../../helpers/api-url'

import { Librix } from '../svgs/librix'
import { LibrixFull } from '../svgs/librix-full'

import styles from './styles.module.scss'

export function Header() {
    const { width } = useScreenDimensions()
    const { user, logout } = useUserContext()

    const [isOpen, setIsOpen] = useState(false)

    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <Link to="/">
                    {width > 600 ? (
                        <LibrixFull width={200} />
                    ) : (
                        <Librix width={42} />
                    )}
                </Link>
            </div>

            {width > 768 && (
                <nav className={styles.navigation}>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive ? styles.activeLink : styles.navLink
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/users"
                        className={({ isActive }) =>
                            isActive ? styles.activeLink : styles.navLink
                        }
                    >
                        Usuários
                    </NavLink>

                    <NavLink
                        to="/reports"
                        className={({ isActive }) =>
                            isActive ? styles.activeLink : styles.navLink
                        }
                    >
                        Relatórios
                    </NavLink>
                </nav>
            )}

            <div className={styles.rightContent}>
                {user ? (
                    <div
                        ref={dropdownRef}
                        className={styles.dropdownContainer}
                    >
                        <button
                            className={styles.profileButton}
                            onClick={() => setIsOpen((value) => !value)}
                        >
                            <span className={styles.userName}>
                                {user.name}
                            </span>

                            {user.avatar ? (
                                <img
                                    src={getApiUrl(`/thumbnails/${user.avatar}`)}
                                    alt={user.name}
                                    className={styles.avatar}
                                />
                            ) : (
                                <div className={styles.avatarFallback}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}

                            <ChevronDown
                                className={`${styles.chevron} ${
                                    isOpen ? styles.chevronOpen : ''
                                }`}
                            />
                        </button>

                        {isOpen && (
                            <div className={styles.dropdown}>
                                <Link
                                    to="/profile"
                                    className={styles.dropdownItem}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User size={18} />
                                    Meu perfil
                                </Link>

                                <Link
                                    to="/settings"
                                    className={styles.dropdownItem}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Settings size={18} />
                                    Configurações
                                </Link>

                                <button
                                    className={styles.dropdownItem}
                                    onClick={() => {
                                        logout?.()
                                        setIsOpen(false)
                                    }}
                                >
                                    <LogOut size={18} />
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className={styles.loginButton}
                    >
                        Entrar
                    </Link>
                )}
            </div>
        </header>
    )
}