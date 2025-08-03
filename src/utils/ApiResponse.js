
export default function ApiResponse(res, {
    statusCode = 200,
    error = null,
    data = null,
    message = ''
} = {}) {

    const payload = {
        success: !error,
        ...(error && { error }),
        ...(message && { message }),
        ...(data && { data }),
    }

    return res
        .status(statusCode)
        .json(payload)
}