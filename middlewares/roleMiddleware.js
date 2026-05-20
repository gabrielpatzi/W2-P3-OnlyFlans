// requireRole('creador') o requireRole('seguidor')
function requireRole(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: `Solo los ${role}es pueden acceder a esta ruta` });
        }
        next();
    };
}

export default requireRole;
