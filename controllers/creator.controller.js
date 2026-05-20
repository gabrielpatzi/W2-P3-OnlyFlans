import {
    getCreatorProfileService,
    updateCreatorProfileService,
    updateProfilePhotoService,
    createGoalService,
    getGoalsService,
    deleteGoalService,
    createPostService,
    getCreatorPageService,
    deletePostService,
    getIncomeReportService,
    searchCreatorsService,
    getPublicCreatorProfileService
} from '../services/creator.service.js';

// ─── Perfil ───────────────────────────────────────────────────────────────────

async function getMyProfile(req, res) {
    const { userId } = req.user;
    try {
        const profile = await getCreatorProfileService(userId);
        if (!profile) return res.status(404).json({ error: 'Perfil no encontrado' });
        return res.status(200).json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

async function updateMyProfile(req, res) {
    const { userId } = req.user;
    try {
        const result = await updateCreatorProfileService(userId, req.body);
        if (!result) return res.status(404).json({ error: 'Perfil no encontrado' });
        return res.status(200).json({ message: 'Perfil actualizado correctamente !' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

async function uploadProfilePhoto(req, res) {
    const { userId } = req.user;
    if (!req.file) return res.status(400).json({ error: 'No se recibio ninguna imagen' });
    try {
        const photoPath = req.file.path;
        await updateProfilePhotoService(userId, photoPath, 'profilePhoto');
        return res.status(200).json({ message: 'Foto de perfil actualizada !', path: photoPath });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

async function uploadBannerPhoto(req, res) {
    const { userId } = req.user;
    if (!req.file) return res.status(400).json({ error: 'No se recibio ninguna imagen' });
    try {
        const photoPath = req.file.path;
        await updateProfilePhotoService(userId, photoPath, 'bannerPhoto');
        return res.status(200).json({ message: 'Banner actualizado !', path: photoPath });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

// ─── Metas ────────────────────────────────────────────────────────────────────

async function createGoal(req, res) {
    const { userId } = req.user;
    try {
        const goal = await createGoalService(userId, req.body);
        return res.status(201).json({ message: 'Meta creada correctamente !', goal });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

async function getMyGoals(req, res) {
    const { userId } = req.user;
    try {
        const goals = await getGoalsService(userId);
        return res.status(200).json(goals);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

async function deleteGoal(req, res) {
    const { userId } = req.user;
    const { goalId } = req.params;
    try {
        const result = await deleteGoalService(parseInt(goalId), userId);
        if (!result) return res.status(404).json({ error: 'Meta no encontrada o sin permisos' });
        return res.status(200).json({ message: 'Meta eliminada correctamente' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

// ─── Posts ────────────────────────────────────────────────────────────────────

async function createPost(req, res) {
    const { userId } = req.user;
    const { text } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    try {
        const post = await createPostService(userId, { text, imageUrl });
        return res.status(201).json({ message: 'Post publicado correctamente !', post });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

// Pagina principal del creador con sus posts y comentarios
async function getMyPage(req, res) {
    const { userId } = req.user;
    try {
        const posts = await getCreatorPageService(userId);
        return res.status(200).json(posts);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

async function deletePost(req, res) {
    const { userId } = req.user;
    const { postId } = req.params;
    try {
        const result = await deletePostService(parseInt(postId), userId);
        if (!result) return res.status(404).json({ error: 'Post no encontrado o sin permisos' });
        return res.status(200).json({ message: 'Post eliminado correctamente' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

// ─── Reporte de ingresos ──────────────────────────────────────────────────────

async function getIncomeReport(req, res) {
    const { userId } = req.user;
    const { startDate, endDate } = req.query;
    try {
        const report = await getIncomeReportService(userId, startDate, endDate);
        return res.status(200).json(report);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno, intente nuevamente' });
    }
}

// ─── Busqueda / perfil publico (usados por ambos roles) ──────────────────────

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

export {
    getMyProfile,
    updateMyProfile,
    uploadProfilePhoto,
    uploadBannerPhoto,
    createGoal,
    getMyGoals,
    deleteGoal,
    createPost,
    getMyPage,
    deletePost,
    getIncomeReport,
    searchCreators,
    getPublicCreatorProfile
};
