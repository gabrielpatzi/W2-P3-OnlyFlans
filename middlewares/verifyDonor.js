import { Donation } from '../models/index.js';

// Verifica que el seguidor autenticado haya donado al creador (creatorId en params)
// Solo usado en rutas donde se necesita haber donado para ver contenido
async function verifyDonor(req, res, next) {
    const { userId } = req.user;
    const { creatorId } = req.params;

    try {
        const hasDonated = await Donation.findOne({
            where: {
                followerId: userId,
                creatorId: parseInt(creatorId)
            }
        });

        if (!hasDonated) {
            return res.status(403).json({ error: 'Debes donar al menos un flan para ver este contenido' });
        }

        next();
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

export default verifyDonor;
