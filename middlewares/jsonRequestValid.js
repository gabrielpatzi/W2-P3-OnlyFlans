function jsonRequestValid(req, res, next) {
    if (!req.is('application/json')) {
        return res.status(415).json({ error: 'Content-Type debe ser application/json' });
    }
    next();
}

export default jsonRequestValid;
