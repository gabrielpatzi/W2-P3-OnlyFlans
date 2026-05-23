import tokenUtils from '../utils/jwt.utils.js';

function authMiddleware(req, res, next) {

    const sessionToken = req.cookies.sessionToken;

    if(!sessionToken){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const nakedPayload = tokenUtils.validateToken(sessionToken);
        req.user = nakedPayload; // { userId, name, role }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalido o expirado' });
    }
}

export default authMiddleware;
