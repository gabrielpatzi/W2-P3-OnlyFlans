import {
    sendDonationService,
    hasDonatedService,
    getDonationHistoryService,
    addFavoriteService,
    removeFavoriteService,
    getFavoritesService,
    getFeedService,
    createCommentService,
    searchCreatorsService,
    getPublicCreatorProfileService
} from '../services/follower.service.js';





async function searchCreators(req, res) {
    const { q } = req.query;
    try {
        const creators = await searchCreatorsService(q || '');
        return res.status(200).json(creators);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

async function getPublicCreatorProfile(req, res) {
    const { creatorId } = req.params;
    try {
        const creator = await getPublicCreatorProfileService(parseInt(creatorId));
        if (!creator) return res.status(404).json({ error: 'Creador no encontrado' });
        return res.status(200).json(creator);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

// ─── Donaciones ───────────────────────────────────────────────────────────────
async function sendDonation(req, res) {
    const { userId } = req.user;
    const { creatorId } = req.params;
    const { flanCount, message } = req.body;

    try {
        // Obtener precio actual del flan del perfil del creador
        const creatorProfile = await CreatorProfile.findOne({ where: { userId: parseInt(creatorId) } });
        if (!creatorProfile) {
            return res.status(404).json({ error: 'Creador no encontrado' });
        }

        if (userId === parseInt(creatorId)) {
            return res.status(400).json({ error: 'No puedes donarte a ti mismo' });
        }

        const donation = await sendDonationService(
            userId,
            parseInt(creatorId),
            flanCount,
            message || null,
            creatorProfile.flanPrice
        );

        return res.status(201).json({
            message: `Donacion de ${flanCount} flan(es) enviada con exito !`,
            donation
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

async function getDonationHistory(req, res) {
    const { userId } = req.user;
    const { startDate, endDate, creatorName } = req.query;

    try {
        const donations = await getDonationHistoryService(userId, { startDate, endDate, creatorName });
        return res.status(200).json(donations);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

// ─── Ver publicaciones del creador (solo si ha donado) ───────────────────────

async function getCreatorPosts(req, res) {
    const { creatorId } = req.params;
    // El middleware verifyDonor ya verifico que el seguidor haya donado
    try {
        const posts = await getCreatorPageService(parseInt(creatorId));
        return res.status(200).json(posts);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

// ─── Comentarios ──────────────────────────────────────────────────────────────

async function commentOnPost(req, res) {
    const { userId } = req.user;
    const { postId } = req.params;
    const { text } = req.body;

    try {
        const comment = await createCommentService(parseInt(postId), userId, text);
        return res.status(201).json({ message: 'Comentario agregado !', comment });
    } catch (error) {
        console.error(error.message);
        const status = error.statusCode || 500;
        return res.status(status).json({ error: error.message });
    }
}

// ─── Favoritos ────────────────────────────────────────────────────────────────

async function addFavorite(req, res) {
    const { userId } = req.user;
    const { creatorId } = req.params;

    try {
        await addFavoriteService(userId, parseInt(creatorId));
        return res.status(201).json({ message: 'Creador agregado a favoritos !' });
    } catch (error) {
        console.error(error.message);
        const status = error.statusCode || 500;
        return res.status(status).json({ error: error.message });
    }
}

async function removeFavorite(req, res) {
    const { userId } = req.user;
    const { creatorId } = req.params;

    try {
        const result = await removeFavoriteService(userId, parseInt(creatorId));
        if (!result) return res.status(404).json({ error: 'Creador no estaba en favoritos' });
        return res.status(200).json({ message: 'Creador removido de favoritos' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

async function getMyFavorites(req, res) {
    const { userId } = req.user;
    try {
        const favorites = await getFavoritesService(userId);
        return res.status(200).json(favorites);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

// ─── Feed ─────────────────────────────────────────────────────────────────────

async function getFeed(req, res) {
    const { userId } = req.user;
    try {
        const feed = await getFeedService(userId);
        return res.status(200).json(feed);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

export {
    sendDonation,
    getDonationHistory,
    getCreatorPosts,
    commentOnPost,
    addFavorite,
    removeFavorite,
    getMyFavorites,
    getFeed,
    searchCreators,
    getPublicCreatorProfile
};
