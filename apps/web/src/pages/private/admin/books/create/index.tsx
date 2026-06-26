import {
    type SubmitEvent,
    type KeyboardEvent,
    useState,
} from 'react'
import { Search } from 'lucide-react'

import {
    MultiSelect,
    type MultiSelectOption,
    type SelectOption,
} from '../../../../../components/inputs'

import styles from './styles.module.scss'
import { pcall } from '../../../../../utils/pcall'
import { AutocompleteInput } from '../../../../../components/inputs/text'

export interface IsbnResponse {
  /**
   * Código ISBN do livro (10 ou 13 dígitos)
   */
  isbn: string

  /**
   * Título principal do livro
   */
  title: string

  /**
   * Subtítulo do livro (se disponível)
   */
  subtitle: string | null

  /**
   * Lista de autores, tradutores e colaboradores
   */
  authors: string[]

  /**
   * Nome da editora responsável pela publicação
   */
  publisher: string

  /**
   * Sinopse ou resumo do conteúdo do livro
   */
  synopsis: string | null

  /**
   * Dimensões físicas do livro
   */
  dimensions: Dimensions

  /**
   * Ano de publicação
   */
  year: number

  /**
   * Formato de publicação do livro
   */
  format: BookFormat

  /**
   * Número total de páginas
   */
  page_count: number | null

  /**
   * Assuntos e categorias do livro
   */
  subjects: string[]

  /**
   * Local de publicação (cidade, estado)
   */
  location: string | null

  /**
   * URL da imagem da capa do livro
   */
  cover_url: string | null

  /**
   * Provedor que forneceu as informações do livro
   */
  provider: BookProvider
}

export interface Dimensions {
  width: number
  height: number
  unit: DimensionUnit
}

export type DimensionUnit = 'CENTIMETER' | 'INCH'

export type BookFormat = 'PHYSICAL' | 'DIGITAL'

export type BookProvider =
  | 'cbl'
  | 'mercado-editorial'
  | 'open-library'
  | 'google-books'

const initialAuthors: MultiSelectOption[] = [
    { id: '1', label: 'Machado de Assis' },
    { id: '2', label: 'Clarice Lispector' },
    { id: '3', label: 'J. R. R. Tolkien' },
    { id: '4', label: 'George Orwell' },
    { id: '5', label: 'Jane Austen' },
    { id: '6', label: 'Fiódor Dostoiévski' },
    { id: '7', label: 'Virginia Woolf' },
    { id: '8', label: 'Ernest Hemingway' },
    { id: '9', label: 'Gabriel García Márquez' },
    { id: '10', label: 'Haruki Murakami' },
]

const initialPublishers: SelectOption[] = [
    { id: '1', label: 'Companhia das Letras' },
    { id: '2', label: 'Editora Record' },
    { id: '3', label: 'Intrínseca' },
]

export function CreateBookPage() {
    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [synopsis, setSynopsis] = useState('')
    // const [publisher, setPublisher] = useState('')
    const [releaseYear, setReleaseYear] = useState('')
    const [pageCount, setPageCount] = useState('')
    const [isbn, setIsbn] = useState('')

    const [authors, setAuthors] = useState<MultiSelectOption[]>([])
    const [availableAuthors] = useState<MultiSelectOption[]>(initialAuthors)

    const [publisher, setPublisher] = useState<string>()

    const [tagInput, setTagInput] = useState('')
    const [tags, setTags] = useState<string[]>([])

    const [coverFile, setCoverFile] = useState<File | null>(null)
    const [coverPreview, setCoverPreview] = useState<string | null>(null)

    async function handleSearchByIsbn() {
        const isbnFormatted = isbn.replace(/[^0-9X]/gi, '')
        if (!isbnFormatted) {
            return
        }

        const response = await fetch(
            `https://brasilapi.com.br/api/isbn/v1/${isbnFormatted}`,
        )

        if (!response.ok) {
            const [_error, data] = await pcall(() => response.json())

            if(response.status === 404) {
                alert('Livro não encontrado para o ISBN informado.')
            } else {
                alert(
                    `Erro ao buscar livro por ISBN: ${data?.message ?? 'Ocorreu um erro desconhecido.'}\n\nVerifique a ortografia e tente novamente.`,
                )
            }

            return
        }

        const data: IsbnResponse = await response.json()

        setTitle(data.title)
        setSubtitle(data.subtitle ?? '')
        setSynopsis(data.synopsis ?? '')
        setReleaseYear(data.year ? String(data.year) : '')
        setPageCount(data.page_count ? String(data.page_count) : '')

        if (data.authors) {
            const authors = data.authors.map((author) => ({
                id: crypto.randomUUID(),
                label: author,
                isNew: true,
            }))

            setAuthors(authors)
        }

        if (data.publisher) {
            console.log('Publisher from ISBN search:', data.publisher)
            setPublisher(data.publisher)
        }

        setTags(data.subjects || [])

        if (data.cover_url) {
            setCoverPreview(data.cover_url)
        }
    }

    function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        setCoverFile(file)

        const preview = URL.createObjectURL(file)

        setCoverPreview(preview)
    }

    function handleAddTag() {
        const tag = tagInput.trim()

        if (!tag) {
            return
        }

        if (
            tags.some(
                (value) =>
                    value.toLowerCase() ===
                    tag.toLowerCase(),
            )
        ) {
            return
        }

        setTags((previous) => [
            ...previous,
            tag,
        ])

        setTagInput('')
    }

    function handleTagKeyDown(
        event: KeyboardEvent<HTMLInputElement>,
    ) {
        if (event.key === 'Enter') {
            event.preventDefault()

            handleAddTag()
        }
    }

    function handleRemoveTag(tag: string) {
        setTags((previous) =>
            previous.filter(
                (value) => value !== tag,
            ),
        )
    }

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault()

        console.log({
            title,
            subtitle,
            synopsis,
            publisher,
            releaseYear,
            pageCount,
            isbn,
            authors: authors.map((author) => ({
                id: author.id,
                name: author.label,
            })),
            tags,
        })

        // TODO:
        // Implementar cadastro do livro.
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div>
                        <h1>Cadastrar item</h1>

                        <p>
                            Preencha as informações do
                            livro para adicioná-lo ao
                            acervo.
                        </p>
                    </div>
                </header>

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >
                    <section className={styles.card}>
                        <div className={styles.sectionHeader}>
                            <h2>
                                Buscar informações pelo
                                ISBN
                            </h2>

                            <p>
                                Utilize o ISBN para
                                preencher automaticamente
                                os dados do livro.
                            </p>
                        </div>

                        <div
                            className={
                                styles.isbnSearchRow
                            }
                        >
                            <div
                                className={
                                    styles.formGroup
                                }
                            >
                                <label htmlFor="isbn">
                                    ISBN
                                </label>

                                <input
                                    id="isbn"
                                    type="text"
                                    placeholder="9788535914849"
                                    value={isbn}
                                    onChange={(e) =>
                                        setIsbn(
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            <button
                                type="button"
                                className={
                                    styles.secondaryButton
                                }
                                onClick={
                                    handleSearchByIsbn
                                }
                            >
                                <Search size={18} />

                                Buscar
                            </button>
                        </div>
                    </section>

                    <section className={styles.card}>
                        <div className={styles.sectionHeader}>
                            <h2>Informações do livro</h2>
                        </div>

                        <div className={styles.bookLayout}>
                            <div className={styles.formColumn}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="title">
                                        Título do livro
                                    </label>

                                    <input
                                        id="title"
                                        type="text"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="subtitle">
                                        Subtítulo
                                    </label>

                                    <input
                                        id="subtitle"
                                        type="text"
                                        value={subtitle}
                                        onChange={(e) =>
                                            setSubtitle(e.target.value)
                                        }
                                    />
                                </div>

                                <MultiSelect
                                    label="Autores"
                                    placeholder="Pesquisar ou cadastrar autor"
                                    options={availableAuthors}
                                    value={authors}
                                    onChange={setAuthors}
                                    allowCreate
                                />

                                <div className={styles.formGroup}>
                                    <AutocompleteInput
                                        label='Editora'
                                        placeholder='Digite o nome da editora'
                                        onChange={(value) => setPublisher(value ?? '')}
                                        options={initialPublishers.map(p => p.label)}
                                        value={publisher ?? ''}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>
                                        Tags / Gêneros
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Pressione Enter para adicionar"
                                        value={tagInput}
                                        onChange={(e) =>
                                            setTagInput(e.target.value)
                                        }
                                        onKeyDown={handleTagKeyDown}
                                    />

                                    <div className={styles.chips}>
                                        {tags.map((tag) => (
                                            <div
                                                key={tag}
                                                className={styles.chip}
                                            >
                                                <span>{tag}</span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveTag(tag)
                                                    }
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.inlineFields}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="releaseYear">
                                            Ano de lançamento
                                        </label>

                                        <input
                                            id="releaseYear"
                                            type="number"
                                            value={releaseYear}
                                            onChange={(e) =>
                                                setReleaseYear(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="pageCount">
                                            Número de páginas
                                        </label>

                                        <input
                                            id="pageCount"
                                            type="number"
                                            value={pageCount}
                                            onChange={(e) =>
                                                setPageCount(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="synopsis">
                                        Sinopse
                                    </label>

                                    <textarea
                                        id="synopsis"
                                        rows={8}
                                        value={synopsis}
                                        onChange={(e) =>
                                            setSynopsis(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className={styles.coverColumn}>
                                <label htmlFor="cover">
                                    Capa do livro
                                </label>

                                <label
                                    htmlFor="cover"
                                    className={styles.coverCard}
                                >
                                    {coverPreview ? (
                                        <img
                                            src={coverPreview}
                                            alt="Capa do livro"
                                            className={styles.coverPreview}
                                        />
                                    ) : (
                                        <div
                                            className={styles.coverPlaceholder}
                                        >
                                            <span>
                                                Clique para selecionar
                                                <br />
                                                a capa do livro
                                            </span>
                                        </div>
                                    )}

                                    <div className={styles.coverOverlay}>
                                        Alterar capa
                                    </div>
                                </label>

                                <input
                                    id="cover"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                    className={styles.hiddenFileInput}
                                />

                                {coverFile && (
                                    <button
                                        type="button"
                                        className={styles.removeCoverButton}
                                        onClick={() => {
                                            setCoverFile(null)
                                            setCoverPreview(null)
                                        }}
                                    >
                                        Remover capa
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    <div className={styles.actions}>
                        <button
                            type="submit"
                            className={
                                styles.primaryButton
                            }
                        >
                            Cadastrar livro
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}