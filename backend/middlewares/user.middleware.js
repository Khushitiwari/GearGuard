import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized" })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        req.user = {
            id: decodedToken.id,
            role: decodedToken.role
        }

        next()
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({ success: false, message: 'Invalid token' })
    }
}

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.json({ success: false, message: 'Not Authorised' });
        }
        next()
    }
}

export { userAuth, authorizeRoles }