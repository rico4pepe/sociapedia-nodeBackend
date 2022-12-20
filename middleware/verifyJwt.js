import jwt from 'jsonwebtoken'

export const verifyJwt = (req, res, next) =>{
    const authHeader = req.headers.authorization || req.headers.Authorization

    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({message: "unauthorized"})
    }
    const token = authHeader.split(' ')[1]

    jwt.verify(
        token, 
        process.env.JSON_SECRET_KEY, 
        (err, decoded) =>{
            if(err) return res.status(403).json({message: 'Forbidden'})
            req.user = decoded.UserInfo.email
            req.roles = decoded.UserInfo.roles
            next()
        }
    )
}