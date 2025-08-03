
export default function generateSlug(title = '') {
    const keywords = title.trim().toLowerCase().split(' ').map(keyword => keyword.trim())
    return keywords.join('-')
}
