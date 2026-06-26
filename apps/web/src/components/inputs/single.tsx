import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { Plus, Trash } from 'lucide-react'

import styles from './styles.module.scss'

export type SelectOption = {
    id: string
    label: string
}

export type SelectOptionValue = SelectOption & {
    isNew: boolean
}

type SingleSelectProps = {
    label: string
    placeholder?: string
    options: SelectOption[]
    value: Omit<SelectOptionValue, 'isNew'> & { isNew?: boolean } | null
    onChange: (value: SelectOptionValue | null) => void
    searchable?: boolean
    allowCreate?: boolean
}

export function SingleSelect({
    label,
    placeholder = 'Selecione uma opção',
    options,
    value,
    onChange,
    searchable = true,
    allowCreate = false,
}: SingleSelectProps) {
    const [search, setSearch] = useState(value?.label ?? '')
    const [isOpen, setIsOpen] = useState(false)

    value = value ? { ...value, isNew: value.isNew ?? false } : null

    const containerRef = useRef<HTMLDivElement>(null)   

    const filteredOptions = useMemo(() => {
        const query = search.toLowerCase()

        return options.filter((option) =>
            option.label.toLowerCase().includes(query),
        )
    }, [search, options])

    const canCreate =
        allowCreate &&
        search.trim() !== '' &&
        !options.some(
            (option) =>
                option.label.toLowerCase() ===
                search.trim().toLowerCase(),
        )

    function handleOpen() {
        setSearch(value?.label ?? '')
        setIsOpen(true)
    }

    function handleSelect(option: SelectOption) {
        onChange({ ...option, isNew: false })

        setSearch('')
        setIsOpen(false)
    }

    function handleCreate() {
        const label = search.trim()

        if (!label) {
            return
        }

        const newOption: SelectOptionValue = {
            id: crypto.randomUUID(),
            label,
            isNew: true,
        }

        onChange(newOption)

        setSearch('')
        setIsOpen(false)
    }

    function handleClear() {
        onChange(null)

        setSearch('')
        setIsOpen(false)
    }

    useEffect(() => {
        function handleClickOutside(
            event: MouseEvent,
        ) {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node,
                )
            ) {
                setIsOpen(false)
                setSearch('')
            }
        }

        document.addEventListener(
            'mousedown',
            handleClickOutside,
        )

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside,
            )
        }
    }, [])

    const inputValue = isOpen
        ? search
        : value?.label ?? ''

    return (
        <div 
            ref={containerRef}
            className={styles.container}
        >
            <label>{label}</label>

            <div className={styles.selectWrapper}>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    readOnly={!searchable}
                    onFocus={handleOpen}
                    onClick={handleOpen}
                    onChange={(e) => {
                        setSearch(e.target.value)

                        if (!isOpen) {
                            setIsOpen(true)
                        }
                    }}
                    onKeyDown={(event) => {
                        if (event.key !== 'Enter') {
                            return
                        }

                        event.preventDefault()

                        if (filteredOptions.length > 0) {
                            handleSelect(
                                filteredOptions[0],
                            )
                            return
                        }

                        if (canCreate) {
                            handleCreate()
                        }
                    }}
                />

                {isOpen && (
                    <div className={styles.dropdown}>
                        {value && (
                            <button
                                type="button"
                                onClick={handleClear}
                            >
                                <Trash size={16} />

                                Limpar seleção
                            </button>
                        )}

                        {filteredOptions.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => handleSelect(option)}
                            >
                                {option.label}
                            </button>
                        ))}

                        {canCreate && (
                            <button
                                type="button"
                                onClick={handleCreate}
                            >
                                <Plus size={16} />

                                Cadastrar "{search}"
                            </button>
                        )}

                        {!filteredOptions.length &&
                            !canCreate && (
                                <button
                                    type="button"
                                    disabled
                                >
                                    Nenhuma opção encontrada
                                </button>
                            )}
                    </div>
                )}
            </div>
        </div>
    )
}