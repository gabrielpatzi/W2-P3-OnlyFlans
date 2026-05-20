import tokenUtils from '../utils/jwt.utils.js';

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const payload = tokenUtils.validateToken(parts[1]);
        req.user = payload; // { userId, name, role }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalido o expirado' });
    }
}

export default authMiddleware;
