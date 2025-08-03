
export default function handler(controllerFn) {
    return async (req, res, next) => {
        try {
            await controllerFn(req, res, next);
        } catch (error) {
            console.log("Failed to resolve request", error)
            return res
                .status(500)
                .json({
                    message: error.message || 'Internal Server Error',
                    success: false,
                })
        }
    }
}