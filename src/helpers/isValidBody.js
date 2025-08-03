
export default function isValidBody(body) {
    if (!Array.isArray(body)) return false

    return body.every(item =>
        item &&
        typeof item === 'object' &&
        typeof item.content_type === 'string' &&
        typeof item.body === 'string'
    )
}
