export function getApiUrl(path: string) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:7654'
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
}