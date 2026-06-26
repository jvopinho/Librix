import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

import styles from './styles.module.scss'

type AutocompleteInputProps = {
    label: string
    placeholder?: string
    options: string[]
    value: string | null
    onChange: (
        value: string | null,
    ) => void
}

export function AutocompleteInput({
    label,
    placeholder,
    options,
    value,
    onChange,
}: AutocompleteInputProps) {
    const [search, setSearch] = useState(
        value ?? '',
    )
    const [isOpen, setIsOpen] = useState(false)

    const containerRef =
        useRef<HTMLDivElement>(null)

    const normalizedValue = value ?? null

    useEffect(() => {
        setSearch(normalizedValue ?? '')
    }, [normalizedValue])

    const filteredOptions = useMemo(() => {
        const query = search.trim().toLowerCase()

        if (!query) {
            return options
        }

        return options.filter((option) =>
            option
                .toLowerCase()
                .includes(query),
        )
    }, [options, search])

    function handleSelect(
        option: string,
    ) {
        onChange(option)

        setSearch(option)
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
                    value={search}
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => {
                        const value =
                            e.target.value

                        setSearch(value)
                        setIsOpen(true)

                        if (!value.trim()) {
                            onChange(null)
                        }
                    }}
                    onKeyDown={(event) => {
                        if (
                            event.key !== 'Enter'
                        ) {
                            return
                        }

                        event.preventDefault()

                        handleSelect(event.currentTarget.value)
                    }}
                />
            </div>

            {isOpen && filteredOptions.length > 0 && (
                <div className={styles.dropdown}>
                    {filteredOptions.map(
                        (option, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() =>
                                    handleSelect(
                                        option,
                                    )
                                }
                            >
                                {option}
                            </button>
                        ),
                    )}
                </div>
            )}
        </div>
    )
}