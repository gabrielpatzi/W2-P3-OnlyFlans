import { Donation, Favorite, Post, Comment, User, CreatorProfile } from '../models/index.js';
import { Op } from 'sequelize';

//busqueda de creadores

async function searchCreatorsService(query) {
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
            ],
            order:[['name', 'ASC']]
        });

        return creators;
    } catch (error) {
        throw error;
    }
}

async function getPublicCreatorProfileService(creatorId) {
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
}

// ─── Donaciones ───────────────────────────────────────────────────────────────
async function sendDonationService(followerId, creatorId, flanCount, message, flanPrice) {
    try {
        const donation = await Donation.create({
            followerId,
            creatorId,
            flanCount,
            message,
            flanPrice
        });
        return donation;
    } catch (error) {
        throw error;
    }
}

async function hasDonatedService(followerId, creatorId) {
    try {
        const donation = await Donation.findOne({ where: { followerId, creatorId } });
        return !!donation;
    } catch (error) {
        throw error;
    }
}

// Historial de donaciones del seguidor con filtros
async function getDonationHistoryService(followerId, { startDate, endDate, creatorName }) {
    try {
        const where = { followerId };

        if (startDate || endDate) {
            where.created_at = {};
            if (startDate) where.created_at[Op.gte] = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                where.created_at[Op.lte] = end;
            }
        }

        const creatorWhere = { role: 'creador' };
        if (creatorName) {
            creatorWhere.name = { [Op.iLike]: `%${creatorName}%` };
        }

        const donations = await Donation.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'creator',
                    where: creatorWhere,
                    attributes: ['userId', 'name']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        return donations;
    } catch (error) {
        throw error;
    }
}

// ─── Favoritos ────────────────────────────────────────────────────────────────

async function addFavoriteService(followerId, creatorId) {
    try {
        const existing = await Favorite.findOne({ where: { followerId, creatorId } });
        if (existing) {
            const error = new Error('El creador ya esta en tus favoritos');
            error.statusCode = 400;
            throw error;
        }
        return await Favorite.create({ followerId, creatorId });
    } catch (error) {
        throw error;
    }
}

async function removeFavoriteService(followerId, creatorId) {
    try {
        const fav = await Favorite.findOne({ where: { followerId, creatorId } });
        if (!fav) return null;
        await fav.destroy();
        return true;
    } catch (error) {
        throw error;
    }
}

async function getFavoritesService(followerId) {
    try {
        const favorites = await Favorite.findAll({
            where: { followerId },
            include: [
                // traemos datos del creador
            ]
        });

        // Traemos los creadores con sus perfiles
        const creatorIds = favorites.map(f => f.creatorId);
        const creators = await User.findAll({
            where: { userId: { [Op.in]: creatorIds }, role: 'creador' },
            attributes: ['userId', 'name'],
            include: [
                {
                    model: CreatorProfile,
                    as: 'creatorProfile',
                    attributes: ['profilePhoto', 'bannerPhoto', 'bio']
                }
            ]
        });

        return creators;
    } catch (error) {
        throw error;
    }
}

// ─── Feed ─────────────────────────────────────────────────────────────────────

// Feed: posts de los creadores a los que el seguidor ha donado al menos 1 flan
async function getFeedService(followerId) {
    try {
        // Encontramos los creadores a los que el seguidor haya donado
        const donations = await Donation.findAll({
            where: { followerId },
            attributes: ['creatorId'],
            group: ['creatorId']
        });

        const creatorIds = donations.map(d => d.creatorId);

        if (creatorIds.length === 0) return [];

        const posts = await Post.findAll({
            where: { userId: { [Op.in]: creatorIds } },
            include: [
                { model: User, as: 'creator', attributes: ['userId', 'name'] }
            ],
            order: [['created_at', 'DESC']]
        });

        return posts;
    } catch (error) {
        throw error;
    }
}

// ─── Comentarios ──────────────────────────────────────────────────────────────

async function createCommentService(postId, userId, text) {
    try {
        // Verificar que el post exista
        const post = await Post.findByPk(postId);
        if (!post) {
            const error = new Error('Post no encontrado');
            error.statusCode = 404;
            throw error;
        }
        return await Comment.create({ postId, userId, text });
    } catch (error) {
        throw error;
    }
}

export {
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
};
