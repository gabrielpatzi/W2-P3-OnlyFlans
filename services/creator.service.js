import { User, CreatorProfile, Goal, Post, Comment, Donation } from '../models/index.js';
import { Op } from 'sequelize';

// ─── Perfil ───────────────────────────────────────────────────────────────────

async function getCreatorProfileService(creatorId) {
    try {
        const profile = await CreatorProfile.findOne({
            where: { userId: creatorId },
            include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
        });
        return profile;
    } catch (error) {
        throw error;
    }
}

async function updateCreatorProfileService(userId, updateData) {
    try {
        const profile = await CreatorProfile.findOne({ where: { userId } });
        if (!profile) return null;
        const {bio} = updateData;
        await profile.update({bio});
        return profile;
    } catch (error) {
        throw error;
    }
}

async function updateProfilePhotoService(userId, photoPath, type) {
    // type: 'profilePhoto' | 'bannerPhoto'
    try {
        const profile = await CreatorProfile.findOne({ where: { userId } });
        if (!profile) return null;
        await profile.update({ [type]: photoPath });
        return profile;
    } catch (error) {
        throw error;
    }
}

// ─── Metas ────────────────────────────────────────────────────────────────────

async function createGoalService(userId, goalData) {
    try {
        return await Goal.create({ ...goalData, userId });
    } catch (error) {
        throw error;
    }
}

async function getGoalsService(userId) {
    try {
        return await Goal.findAll({ where: { userId } });
    } catch (error) {
        throw error;
    }
}

async function deleteGoalService(goalId, userId) {
    try {
        const goal = await Goal.findOne({ where: { goalId, userId } });
        if (!goal) return null;
        await goal.destroy();
        return true;
    } catch (error) {
        throw error;
    }
}

// ─── Posts ────────────────────────────────────────────────────────────────────

async function createPostService(userId, postData) {
    try {
        return await Post.create({ ...postData, userId });
    } catch (error) {
        throw error;
    }
}

// Pagina principal del creador: sus posts con comentarios
async function getCreatorPageService(creatorId) {
    try {
        const posts = await Post.findAll({
            where: { userId: creatorId },
            include: [
                {
                    model: Comment,
                    as: 'comments',
                    include: [{ model: User, as: 'follower', attributes: ['userId', 'name'] }]
                }
            ],
            order: [['created_at', 'DESC']]
        });
        return posts;
    } catch (error) {
        throw error;
    }
}

async function deletePostService(postId, userId) {
    try {
        const post = await Post.findOne({ where: { postId, userId } });
        if (!post) return null;
        await post.destroy();
        return true;
    } catch (error) {
        throw error;
    }
}

// ─── Reporte de ingresos ──────────────────────────────────────────────────────

async function getIncomeReportService(creatorId, startDate, endDate) {
    try {
        const where = { creatorId };

        if (startDate || endDate) {
            where.created_at = {};
            if (startDate) where.created_at[Op.gte] = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                where.created_at[Op.lte] = end;
            }
        }

        const donations = await Donation.findAll({
            where,
            include: [{ model: User, as: 'follower', attributes: ['userId', 'name', 'email'] }],
            order: [['created_at', 'DESC']]
        });

        const totalFlanes = donations.reduce((sum, d) => sum + d.flanCount, 0);

        return { donations, totalFlanes };
    } catch (error) {
        throw error;
    }
}

// ─── Busqueda de creadores (para seguidores) ──────────────────────────────────

/*async function searchCreatorsService(query) {
    try {
        const where = { role: 'creador' };
        if (query) {
            where.name = { [Op.iLike]: `%${query}%` };
        }

        const creators = await User.findAll({
            where,
            attributes: ['userId', 'name'],
            include: [
                {
                    model: CreatorProfile,
                    as: 'creatorProfile',
                    attributes: ['profilePhoto', 'bannerPhoto', 'bio', 'flanPrice']
                }
            ]
        });

        return creators;
    } catch (error) {
        throw error;
    }
}
*/
// Perfil publico de un creador (sin posts — para ver posts hay que haber donado)
/*async function getPublicCreatorProfileService(creatorId) {
    try {
        const creator = await User.findOne({
            where: { userId: creatorId, role: 'creador' },
            attributes: ['userId', 'name'],
            include: [
                {
                    model: CreatorProfile,
                    as: 'creatorProfile',
                    attributes: ['profilePhoto', 'bannerPhoto', 'bio', 'flanPrice']
                },
                { model: Goal, as: 'goals', attributes: ['goalId', 'title', 'description'] }
            ]
        });
        return creator;
    } catch (error) {
        throw error;
    }
}*/

export {
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
};
