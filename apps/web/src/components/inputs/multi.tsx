import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'

import styles from './styles.module.scss'

export type MultiSelectOption = {
    id: string
    label: string
}

export type MultiSelectOptionValue = MultiSelectOption & {
    isNew: boolean
}

type MultiSelectProps = {
    label: string
    placeholder?: string
    options: MultiSelectOption[]
    value: Array<Omit<MultiSelectOptionValue, 'isNew'> & { isNew?: boolean }>
    onChange: (value: MultiSelectOptionValue[]) => void
    allowCreate?: boolean
    useEnterToSelect?: boolean
}

export function MultiSelect({
    label,
    placeholder,
    options,
    value: _value,
    onChange,
    allowCreate = true,
    useEnterToSelect = true,
}: MultiSelectProps) {
    const [search, setSearch] = useState('')

    let value = _value.map((v) => ({ ...v, isNew: v.isNew ?? false }))

    const containerRef = useRef<HTMLDivElement>(null)
    
    const filteredOptions = useMemo(() => {
        return options.filter(
            (option) =>
                option.label
            .toLowerCase()
            .includes(search.toLowerCase()) &&
            !value.some(
                (selected) => selected.id === option.id,
            ),
        )
    }, [search, options, value])
    
    function handleSelect(option: MultiSelectOption) {
        onChange([
            ...value.map((v) => ({ ...v, isNew: false })), 
            { ...option, isNew: false }
        ])
        setSearch('')
    }
    
    function handleRemove(id: string) {
        onChange(
            value.filter((option) => option.id !== id),
        )
    }
    
    function handleCreate() {
        const name = search.trim()
        
        if (!name) {
            return
        }
        
        const newOption: MultiSelectOption = {
            id: crypto.randomUUID(),
            label: name,
        }
        
        onChange([...value, { ...newOption, isNew: true }])
        
        setSearch('')
    }
    
    function handleKeyDown(
        event: React.KeyboardEvent<HTMLInputElement>,
    ) {
        if (event.key !== 'Enter') {
            return
        }
        
        event.preventDefault()
        
        const firstOption = filteredOptions[0]
        
        if (firstOption) {
            handleSelect(firstOption)
            return
        }
        
        if (allowCreate) {
            handleCreate()
        }
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
    
    return (
        <div 
            ref={containerRef}
            className={styles.container}
        >
        <label>{label}</label>
        
        <input
            type="text"
            value={search}
            placeholder={placeholder}
            onChange={(e) =>
                setSearch(e.target.value)
            }
            onKeyDown={useEnterToSelect ? handleKeyDown : undefined}
        />
        
        {search && (
            <div className={styles.dropdown}>
            {filteredOptions.map((option) => (
                <button
                key={option.id}
                type="button"
                onClick={() =>
                    handleSelect(option)
                }
                >
                {option.label}
                </button>
            ))}
            
            {allowCreate && (
                <button
                type="button"
                onClick={handleCreate}
                >
                <Plus size={16} />
                
                Cadastrar "{search}"
                </button>
            )}
            </div>
        )}
        
        {value.length > 0 && (
            <div className={styles.chips}>
                {value.map((option) => (
                    <div
                    key={option.id}
                    className={styles.chip}
                    >
                    <span>{option.label}</span>
                    
                    <button
                    type="button"
                    onClick={() =>
                        handleRemove(option.id)
                    }
                    >
                    <X size={14} />
                    </button>
                    </div>
                ))}
            </div>
        )}
        </div>
    )
}